export type DiscountType = "percentage" | "fixed";

export interface PromoCode {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxUses?: number;
  currentUses: number;
  maxUsesPerUser: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
}