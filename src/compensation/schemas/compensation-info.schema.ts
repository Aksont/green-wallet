import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DonationInfo {
  @Prop({ required: true })
  trees!: number;

  @Prop({ required: true })
  unitPrice!: number;

  @Prop({ required: true })
  totalPrice!: number;

  @Prop({ required: true })
  currency!: string;
}

export const DonationInfoSchema = SchemaFactory.createForClass(DonationInfo);

@Schema({ _id: false })
export class VolunteeringInfo {
  @Prop({ required: true })
  hours!: number;
}

export const VolunteeringInfoSchema =
  SchemaFactory.createForClass(VolunteeringInfo);

export type CompensationInfoDocument = CompensationInfo & Document;

@Schema({})
export class CompensationInfo {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  tripId!: string;

  @Prop({ required: true })
  projectId!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ type: DonationInfoSchema })
  donation?: DonationInfo;

  @Prop({ type: VolunteeringInfoSchema })
  volunteering?: VolunteeringInfo;

  @Prop({ required: true })
  compensatedCo2!: number;

  @Prop({ required: true })
  remainingCo2Compensation!: number;
}

export const CompensationInfoSchema =
  SchemaFactory.createForClass(CompensationInfo);
