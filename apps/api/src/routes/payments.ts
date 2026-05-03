import { render } from "@react-email/render";
import { Hono } from "hono";
import Stripe from "stripe";
import dbConnect from "../db";
import { sendEmail } from "../email/client";
import { OrderConfirmationEmail } from "../email/templates/order-confirmation";
import { ErrorCodes } from "../lib/error-codes";
import { error, success } from "../lib/response";
import { Competition, Entry, Order, Profile } from "../models";

const app = new Hono();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-04-22.dahlia",
});

// POST /api/payments/create-checkout-session
// Body: { items: [{competitionId, quantity}], userId, promoCode?, subtotal, discount? }
app.post("/create-checkout-session", async (c) => {
  try {
    const body = await c.req.json();
    const { items, userId, subtotal, discount, email } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return error(c, ErrorCodes.VALIDATION_ERROR, "items array is required", 400);
    }
    if (!userId) {
      return error(c, ErrorCodes.VALIDATION_ERROR, "userId is required", 400);
    }

    await dbConnect();

    // Validate all competitions and build line items for Stripe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems: any[] = [];
    const competitionIds: string[] = [];

    for (const item of items) {
      const competition = await Competition.findById(item.competitionId).lean();
      if (!competition) {
        return error(c, ErrorCodes.NOT_FOUND, `Competition ${item.competitionId} not found`, 404);
      }
      if (competition.status !== "active") {
        return error(
          c,
          ErrorCodes.VALIDATION_ERROR,
          `Competition "${competition.title}" is not active`,
          400
        );
      }
      const available = competition.maxTickets - (competition.ticketsSold || 0);
      if (item.quantity > available) {
        return error(
          c,
          ErrorCodes.VALIDATION_ERROR,
          `Only ${available} tickets available for "${competition.title}"`,
          400
        );
      }

      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${competition.title} — ${item.quantity} ticket${item.quantity > 1 ? "s" : ""}`,
            description: `Prize: ${competition.prizeTitle ?? competition.title}`,
          },
          unit_amount: Math.round(competition.ticketPrice * 100), // stripe uses pence
        },
        quantity: item.quantity,
      });

      competitionIds.push(item.competitionId);
    }

    const total = subtotal - (discount || 0);

    // Create pending order
    const order = await Order.create({
      orderNumber: Date.now(),
      userId,
      status: "pending",
      subtotal: subtotal || 0,
      discountAmount: discount || 0,
      total,
      promoCodeId: undefined,
      referralBonusTickets: 0,
      referralBalanceUsed: 0,
      stripeSessionId: "", // will be updated after Stripe session creation
    });

    // Create Stripe Checkout session
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await (stripe.checkout.sessions.create as any)({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      client_reference_id: order._id.toString(), // link Stripe session to our order
      metadata: {
        orderId: order._id.toString(),
        userId,
        competitionIds: competitionIds.join(","),
        items: JSON.stringify(items),
      },
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart`,
    });

    // Store the real Stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    return success(c, {
      orderId: order._id,
      sessionId: session.id,
      url: session.url, // frontend redirects here
      status: "pending",
      amount: total,
      currency: "gbp",
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return error(c, ErrorCodes.INTERNAL_ERROR, "Internal server error", 500);
  }
});

// POST /api/payments/webhook — receives Stripe webhook events
app.post("/webhook", async (c) => {
  try {
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return error(
        c,
        ErrorCodes.VALIDATION_ERROR,
        "Missing stripe-signature or webhook secret",
        400
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return error(c, ErrorCodes.VALIDATION_ERROR, "Webhook signature verification failed", 400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      await dbConnect();

      const order = await Order.findOne({ stripeSessionId: session.id });
      if (!order) {
        return error(c, ErrorCodes.NOT_FOUND, "Order not found", 404);
      }

      if (order.status === "completed") {
        // Idempotent - already processed
        return success(c, { order: order._id, status: "already_completed" });
      }

      const metadata = session.metadata || {};
      const competitionIds = (metadata.competitionIds || "").split(",").filter(Boolean);
      const items = JSON.parse(metadata.items || "[]");

      // Create entries for each competition
      const emailItems: Array<{
        competitionTitle: string;
        quantity: number;
        unitPrice: number;
        ticketNumbers: number[];
        totalPrice: number;
      }> = [];

      for (let i = 0; i < competitionIds.length; i++) {
        const competition = await Competition.findById(competitionIds[i]).lean();
        if (!competition) continue;

        const item = items[i];
        const startTicket = (competition.ticketsSold || 0) + 1;
        const ticketNumbers = Array.from({ length: item.quantity }, (_, idx) => startTicket + idx);

        await Entry.create({
          userId: order.userId,
          competitionId: competitionIds[i],
          orderId: order._id,
          ticketNumbers,
          quantity: item.quantity,
          answerIndex: item.answerIndex,
        });

        await Competition.findByIdAndUpdate(competitionIds[i], {
          $inc: { ticketsSold: item.quantity },
        });

        await Profile.findByIdAndUpdate(order.userId, {
          $inc: {
            totalEntries: item.quantity,
            totalSpent: competition.ticketPrice * item.quantity,
          },
        });

        emailItems.push({
          competitionTitle: competition.title,
          quantity: item.quantity,
          unitPrice: competition.ticketPrice,
          ticketNumbers,
          totalPrice: competition.ticketPrice * item.quantity,
        });
      }

      // Complete the order
      order.status = "completed";
      order.paidAt = new Date();
      await order.save();

      // Send order confirmation email
      const profile = await Profile.findById(order.userId).lean();
      if (profile?.email) {
        const userName = profile.fullName || profile.email.split("@")[0] || "Customer";
        const orderDate = new Date().toLocaleString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });
        try {
          const emailHtml = await render(
            OrderConfirmationEmail({
              userName,
              orderId: order._id.toString(),
              orderDate,
              items: emailItems,
              subtotal: order.subtotal,
              discount: order.discountAmount,
              total: order.total,
            })
          );
          await sendEmail({
            to: profile.email,
            subject: `Order confirmed — Luxero (#${order._id.toString()})`,
            html: emailHtml,
          });
        } catch (emailErr) {
          console.error("Failed to send order confirmation email:", emailErr);
        }
      }
    }

    return success(c, { received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return error(c, ErrorCodes.INTERNAL_ERROR, "Internal server error", 500);
  }
});

// GET /api/payments/session/:sessionId
app.get("/session/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    await dbConnect();

    const order = await Order.findOne({ stripeSessionId: sessionId }).lean();
    if (!order) {
      return success(c, { sessionId, status: "pending" });
    }

    return success(c, { sessionId, status: order.status });
  } catch (err) {
    console.error("Error verifying session:", err);
    return error(c, ErrorCodes.INTERNAL_ERROR, "Internal server error", 500);
  }
});

export default app;
