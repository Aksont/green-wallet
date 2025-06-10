import { IsString, IsNumber, IsOptional } from 'class-validator';
import { LocationType } from '../enums/location-type.enum';

export class LocationDto {
  @IsString()
  name!: string;

  @IsString()
  country!: string;

  @IsString()
  countryCode!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsOptional()
  @IsString()
  iata!: string;

  @IsString()
  type!: LocationType;

  @IsString()
  showName!: string;
}
