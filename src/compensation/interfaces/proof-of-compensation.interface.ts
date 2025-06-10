import { ProofOfCompensationStatus } from 'src/compensation/enums/proof-of-compensation-status.interface';
import { CompensationInfo } from './compensation-info.interface';

export interface ProofOfCompensation {
  tripId: string; // saving only id for the purpose of having 1-1 mapping to blockchain
  userId: string; // saving only id for the purpose of having 1-1 mapping to blockchain
  trees: number;
  volunteerHours: number;
  donationInfos: CompensationInfo[];
  volunteeringInfos: CompensationInfo[];
  comment: string;
  status: ProofOfCompensationStatus;
}
