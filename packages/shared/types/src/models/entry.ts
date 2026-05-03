export interface Entry {
  userId: string;
  competitionId: string;
  orderId?: string;
  ticketNumbers: number[];
  quantity: number;
  answerIndex?: number;
  answerCorrect?: boolean;
  createdAt: Date;
}