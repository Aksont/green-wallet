export interface CompensationInfo {
  id: string;
  userId: string;
  tripId: string;
  projectId: string;
  date: Date;
  donation?: {
    trees: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
  };
  volunteering?: {
    hours: number;
  };
  compensatedCo2: number;
  remainingCo2Compensation: number;
}
