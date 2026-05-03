import { api } from "@luxero/api-client";
import { useAuth } from "@luxero/auth";
import { useCart } from "@luxero/cart";
import { Button, Input } from "@luxero/ui";
import { Minus, Plus, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    updateQuantity,
    removeItem,
    promoCode,
    promoDiscount,
    setPromoCode,
    getSubtotal,
    getTotal,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  async function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsApplying(true);
    setPromoError("");

    try {
      const res = await api.post<{ data: { code: string; discount: number } }>(
        "/api/promo-codes/validate",
        {
          code: promoInput,
          subtotal: getSubtotal(),
        }
      );
      setPromoCode(res.data.code, res.data.discount);
    } catch {
      setPromoError("Invalid or expired promo code");
    } finally {
      setIsApplying(false);
    }
  }

  async function handleCheckout() {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    // Proceed to checkout - this would call /api/payments/create-checkout-session
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-gold" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start browsing competitions to add tickets to your cart.
            </p>
            <Link to="/competitions">
              <Button className="btn-luxury">Browse Competitions</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = getTotal();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.competitionId}
                className="bg-card rounded-xl border border-gold/10 p-4 flex gap-4"
              >
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">🏆</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 truncate">{item.competitionTitle}</h3>
                  <p className="text-gold font-bold mb-3">£{item.price.toFixed(2)} per ticket</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.competitionId, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.competitionId, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => removeItem(item.competitionId)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-gold/10 p-6 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>

              {promoDiscount !== null && promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Promo Discount</span>
                  <span>-£{promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg pt-4 border-t border-gold/10">
                <span>Total</span>
                <span className="text-gold">£{total.toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full btn-luxury" onClick={handleCheckout}>
                {user ? "Proceed to Checkout" : "Login to Checkout"}
              </Button>
            </div>

            {/* Promo Code */}
            {promoCode ? (
              <div className="bg-card rounded-xl border border-green-500/20 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Promo Applied</p>
                    <p className="font-semibold text-green-400">{promoCode}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setPromoCode(null, null)}>
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline" disabled={isApplying}>
                  {isApplying ? "Applying..." : "Apply"}
                </Button>
              </form>
            )}
            {promoError && <p className="text-red-400 text-sm">{promoError}</p>}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
