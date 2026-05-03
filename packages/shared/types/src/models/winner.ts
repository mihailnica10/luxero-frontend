export interface Winner {
  competitionId: string;
  userId: string;
  entryId?: string;
  ticketNumber: number;
  prizeTitle?: string;
  prizeValue?: number;
  prizeImageUrl?: string;
  displayName?: string;
  location?: string;
  testimonial?: string;
  winnerPhotoUrl?: string;
  showFullName: boolean;
  claimed: boolean;
  claimedAt?: Date;
  drawnAt: Date;
  createdAt: Date;
}