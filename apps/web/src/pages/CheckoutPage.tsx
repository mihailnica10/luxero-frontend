import { api } from "@luxero/api-client";
import { useAuth } from "@luxero/auth";
import { useCart } from "@luxero/cart";
import { Button, Card, CardContent } from "@luxero/ui";
import { Lock, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, promoCode, promoDiscount, getSubtotal, getTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getSubtotal();
  const total = getTotal();
  const discount = promoDiscount || 0;

  async function handlePayment() {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const payload = {
        items: items.map((item) => ({
          competitionId: item.competitionId,
          quantity: item.quantity,
          answerIndex: item.answerIndex,
        })),
        userId: user.id,
        promoCode: promoCode || undefined,
        subtotal,
        discount,
      };

      const res = await api.post<{ data: { orderId: string; status: string } }>(
        "/api/payments/create-checkout-session",
        payload
      );

      if (res.data.status === "succeeded") {
        clearCart();
        navigate("/checkout/success", { state: { orderId: res.data.orderId } });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-gold/20">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.competitionId}
                      className="flex justify-between items-center py-2 border-b border-gold/10"
                    >
                      <div>
                        <p className="font-medium">{item.competitionTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} ticket{item.quantity > 1 ? "s" : ""} at £
                          {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gold/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Promo Discount ({promoCode})</span>
                      <span>-£{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-gold">£{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="border-gold/20">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gold/20 bg-card">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <div>
                    <p className="font-medium text-sm">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">
                      All payments are processed securely. For demo purposes, clicking "Complete
                      Purchase" will instantly complete your order.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Actions */}
          <div className="space-y-4">
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>256-bit SSL encryption</span>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full btn-luxury"
                  onClick={handlePayment}
                  disabled={isProcessing || items.length === 0}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Complete Purchase — £{total.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By completing this purchase you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secure Checkout</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Encrypted & Protected</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
