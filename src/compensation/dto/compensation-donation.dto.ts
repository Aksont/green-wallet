import { IsString, IsNumber } from 'class-validator';

export class CompensationDto {
  @IsString()
  userId!: string;

  @IsString()
  projectId!: string;

  @IsString()
  tripId!: string;

  @IsNumber()
  amount!: number;
}
