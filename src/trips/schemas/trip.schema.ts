import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Sequence, SequenceSchema } from './sequence.schema';
import { Location, LocationSchema } from './location.schema';

export type TripDocument = Trip & Document;

@Schema()
export class Trip {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ type: LocationSchema, required: true })
  from!: Location;

  @Prop({ type: LocationSchema, required: true })
  to!: Location;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ type: [SequenceSchema], required: true })
  sequences!: Sequence[];

  @Prop({ type: [SequenceSchema] })
  returnSequences?: Sequence[];

  @Prop({ required: true })
  totalDistanceInKm!: number;

  @Prop({ required: true })
  totalCo2emissionInKg!: number;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
