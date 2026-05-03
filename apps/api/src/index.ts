import { Hono } from "hono";
import { cors } from "hono/cors";
import mongoose from "mongoose";
import adminCategories from "./routes/admin/categories";
import adminCompetitions from "./routes/admin/competitions";
import adminInstantPrizes from "./routes/admin/instant-prizes";
import adminLanguages from "./routes/admin/languages";
import adminOrders from "./routes/admin/orders";
import adminPromoCodes from "./routes/admin/promo-codes";
import adminReferralPurchases from "./routes/admin/referral-purchases";
import adminUsers from "./routes/admin/users";
import auth from "./routes/auth";
import categories from "./routes/categories";
import competitions from "./routes/competitions";
import contact from "./routes/contact";
import content from "./routes/content";
import faq from "./routes/faq";
import meEntries from "./routes/me/entries";
import meOrders from "./routes/me/orders";
import meProfile from "./routes/me/profile";
import meReferrals from "./routes/me/referrals";
import payments from "./routes/payments";
import promoCodes from "./routes/promo-codes";
import stats from "./routes/stats";
import winners from "./routes/winners";

const app = new Hono();

// Security headers
app.use("*", async (c, next) => {
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  await next();
});

// Request logging
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${new Date().toISOString()} ${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`);
});

// CORS — restrict to known origins
app.use(
  "*",
  cors({
    origin: [
      "https://luxero.win",
      "https://www.luxero.win",
      "capacitor://localhost",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Health check with MongoDB verification
app.get("/health", async (c) => {
  try {
    const state = mongoose.connection.readyState; // 1 = connected
    if (state !== 1) throw new Error("Not connected");
    await mongoose.connection.db?.admin().ping();
    return c.json({ status: "ok", mongodb: "connected", timestamp: new Date().toISOString() });
  } catch {
    return c.json(
      { status: "error", mongodb: "disconnected", timestamp: new Date().toISOString() },
      503
    );
  }
});

// Public
app.route("/api/competitions", competitions);
app.route("/api/categories", categories);
app.route("/api/winners", winners);
app.route("/api/promo-codes", promoCodes);
app.route("/api/stats", stats);
app.route("/api/payments", payments);
app.route("/api/auth", auth);
app.route("/api/contact", contact);
app.route("/api/faq", faq);
app.route("/api/content", content);

// User-protected
app.route("/api/me/orders", meOrders);
app.route("/api/me/entries", meEntries);
app.route("/api/me/profile", meProfile);
app.route("/api/me/referrals", meReferrals);

// Admin
app.route("/api/admin/competitions", adminCompetitions);
app.route("/api/admin/categories", adminCategories);
app.route("/api/admin/orders", adminOrders);
app.route("/api/admin/users", adminUsers);
app.route("/api/admin/promo-codes", adminPromoCodes);
app.route("/api/admin/instant-prizes", adminInstantPrizes);
app.route("/api/admin/referral-purchases", adminReferralPurchases);
app.route("/api/admin/languages", adminLanguages);

export default app;
