// API response types matching backend envelopes

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Competition {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  status: "active" | "draft" | "ended" | "drawn" | "cancelled";
  ticketPrice: number;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  prizeImageUrl?: string;
  drawDate?: string;
  endDate?: string;
  startDate?: string;
  prizeTitle?: string;
  prizeValue: number;
  totalTickets: number;
  maxTickets: number;
  soldTickets: number;
  ticketsSold?: number;
  maxTicketsPerUser?: number;
  isFeatured?: boolean;
  displayOrder?: number;
  instantPrize?: boolean;
}

export interface CompetitionDetail extends Competition {
  longDescription?: string;
  terms?: string;
  faq?: string;
  answerIndex?: number;
  options?: string[];
  question?: string;
  questionOptions?: string[];
}

export interface Order {
  id: string;
  status: "pending" | "paid" | "failed" | "refunded";
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  competitionId: string;
  competitionTitle: string;
  quantity: number;
  unitPrice: number;
  ticketNumbers: number[];
}

export interface Entry {
  id: string;
  orderId: string;
  competitionId: string;
  competitionTitle: string;
  ticketNumbers: number[];
  status: "active" | "won" | "lost";
  drawDate: string;
}

export interface Winner {
  id: string;
  _id?: string;
  competitionId: string;
  userId: string;
  displayName?: string;
  prizeTitle?: string;
  prizeValue?: number;
  prizeImageUrl?: string;
  testimonial?: string;
  winnerPhotoUrl?: string;
  drawnAt: string;
  location?: string;
  claimed?: boolean;
}

export interface WinnerShowcase {
  id: string;
  name: string;
  initials?: string;
  prize: string;
  prizeValue: number;
  imageUrl?: string;
  testimonial?: string;
  competitionTitle: string;
  winDate: string;
}

export interface WinnerShowcase {
  id: string;
  name: string;
  initials?: string;
  prize: string;
  prizeValue: number;
  imageUrl?: string;
  testimonial?: string;
  competitionTitle: string;
  winDate: string;
}

export interface CartItem {
  competitionId: string;
  competitionTitle: string;
  price: number;
  quantity: number;
  answerIndex: number;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  label: string;
  iconName: string;
  description?: string;
  displayOrder?: number;
  competitionCount?: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface Stats {
  totalCompetitions: number;
  activeCompetitions: number;
  totalWinners: number;
  totalEntries: number;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminCompetition {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  status: string;
  prizeTitle?: string;
  prizeValue: number;
  prizeImageUrl?: string;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  maxTicketsPerUser: number;
  question?: string;
  questionOptions?: string[];
  drawDate?: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  _id: string;
  userId: string;
  userEmail: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPromoCode {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  competitionCount: number;
}

export interface AdminInstantPrize {
  _id: string;
  type: string;
  title: string;
  description?: string;
  probability: number;
  stock: number;
  active: boolean;
}

export interface AdminReferralPurchase {
  _id: string;
  referrerId: string;
  referrerEmail: string;
  referredId: string;
  referredEmail: string;
  orderId: string;
  commission: number;
  createdAt: string;
}