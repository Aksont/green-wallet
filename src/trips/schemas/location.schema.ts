import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LocationType } from '../enums/location-type.enum';

@Schema({ _id: false }) // embed-only, no _id
export class Location {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  country!: string;

  @Prop()
  countryCode?: string;

  @Prop()
  lat?: number;

  @Prop()
  lng?: number;

  @Prop()
  iata?: string;

  @Prop({ enum: LocationType })
  type?: LocationType;

  @Prop({ required: true })
  showName!: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
