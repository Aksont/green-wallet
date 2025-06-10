import { Type } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CreateSequenceDto } from './create-sequence.dto';
import { LocationDto } from './location.dto';

export class CreateTripDto {
  @IsString()
  userId!: string;

  @IsString()
  title!: string;

  @Type(() => LocationDto)
  from!: LocationDto;

  @Type(() => LocationDto)
  to!: LocationDto;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSequenceDto)
  sequences!: CreateSequenceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSequenceDto)
  returnSequences!: CreateSequenceDto[];
}
