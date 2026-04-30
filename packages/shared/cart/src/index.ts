import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@luxero/types";

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (competitionId: string) => void;
  updateQuantity: (competitionId: string, quantity: number) => void;
  setPromoCode: (code: string | null, discount: number | null) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.competitionId === item.competitionId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.competitionId === item.competitionId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (competitionId) => {
        set((state) => ({
          items: state.items.filter((i) => i.competitionId !== competitionId),
        }));
      },

      updateQuantity: (competitionId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(competitionId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.competitionId === competitionId ? { ...i, quantity } : i
          ),
        }));
      },

      setPromoCode: (code, discount) => {
        set({ promoCode: code, promoDiscount: discount });
      },

      clearCart: () => {
        set({ items: [], promoCode: null, promoDiscount: null });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().promoDiscount ?? 0;
        return Math.max(0, subtotal - discount);
      },
    }),
    { name: "luxero-cart" }
  )
);