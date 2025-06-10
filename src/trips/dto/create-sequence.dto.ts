import { IsDateString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { TransportType } from 'src/trips/enums/transport-type.enum';
import { LocationDto } from './location.dto';
import { Type } from 'class-transformer';

export class CreateSequenceDto {
  @Type(() => LocationDto)
  from!: LocationDto;

  @Type(() => LocationDto)
  to!: LocationDto;

  @IsOptional()
  @IsDateString()
  date!: string;

  @IsEnum(TransportType, {
    message:
      'transportType must be one of: FLIGHT, TRAIN, BUS, CAR, BICYCLE, WALK',
  })
  transportType!: TransportType;

  @IsOptional()
  @IsNumber()
  numOfPassangers!: number; // TODO only for cars, validate that it does not exist for other types, validate value in between 1 and 7

  @IsOptional()
  @IsNumber()
  distance!: number; // TODO only for walking/biking, validate that it does not exist for other types, should be implemented with strava but
}
