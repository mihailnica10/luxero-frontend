export type OrderStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface Order {
  orderNumber: number;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  total: number;
  promoCodeId?: string;
  referralBonusTickets: number;
  referralBalanceUsed: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paidAt?: Date;
  createdAt: Date;
}