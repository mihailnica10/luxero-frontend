export type InstantPrizeType = "direct" | "competition_ticket";

export interface InstantPrize {
  competitionId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  value?: number;
  totalQuantity: number;
  remainingQuantity: number;
  winningTicketNumbers: number[];
  prizeType: InstantPrizeType;
  prizeCompetitionId?: string;
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}