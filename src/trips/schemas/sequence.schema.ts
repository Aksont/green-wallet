import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TransportType } from '../enums/transport-type.enum';
import { Location, LocationSchema } from './location.schema';

@Schema({ _id: false }) // embed-only, no _id
export class Sequence {
  @Prop({ type: LocationSchema, required: true })
  from!: Location;

  @Prop({ type: LocationSchema, required: true })
  to!: Location;

  @Prop()
  date?: Date;

  @Prop({ enum: TransportType, required: true })
  transportType!: TransportType;

  @Prop({ required: true })
  distanceInKm!: number;

  @Prop({ required: true })
  co2emissionInKg!: number;

  @Prop()
  numOfPassangers?: number;
}

export const SequenceSchema = SchemaFactory.createForClass(Sequence);
