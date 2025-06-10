import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  CompensationInfo,
  CompensationInfoSchema,
} from './compensation-info.schema';
import { ProofOfCompensationStatus } from '../enums/proof-of-compensation-status.interface';

export type ProofOfCompensationDocument = ProofOfCompensation & Document;

@Schema()
export class ProofOfCompensation {
  @Prop({ required: true })
  tripId!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  trees!: number;

  @Prop({ required: true })
  volunteerHours!: number;

  @Prop({ type: [CompensationInfoSchema], required: true })
  donationInfos!: CompensationInfo[];

  @Prop({ type: [CompensationInfoSchema], required: true })
  volunteeringInfos!: CompensationInfo[];

  @Prop()
  comment!: string;

  @Prop({ required: true, enum: ProofOfCompensationStatus })
  status!: ProofOfCompensationStatus;
}

export const ProofOfCompensationSchema =
  SchemaFactory.createForClass(ProofOfCompensation);
