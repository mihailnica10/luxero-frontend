import { useCart } from "@luxero/cart";
import { Button } from "@luxero/ui";
import { cn } from "@luxero/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CartPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground text-center">Your cart is empty</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/competitions")}>
          Browse Competitions
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold">Cart ({items.length})</h1>
          <button
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3 pb-32">
        {items.map((item) => (
          <div key={item.competitionId} className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-start justify-between mb-3">
              <p className="font-medium text-sm">{item.competitionTitle}</p>
              <button
                onClick={() => removeItem(item.competitionId)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.competitionId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.competitionId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="font-semibold text-gold">£{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-border/20 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="font-semibold">£{getSubtotal().toFixed(2)}</span>
        </div>
        <Button className="w-full" onClick={() => navigate("/checkout")}>
          Checkout — £{getTotal().toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
