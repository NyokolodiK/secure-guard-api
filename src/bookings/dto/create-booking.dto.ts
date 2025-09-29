import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Attire } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  companyId: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  numGuards?: number = 1;

  @IsEnum(Attire)
  @IsOptional()
  attire?: Attire = Attire.SUIT;

  @IsString()
  vehicleType: string;

  @IsString()
  pickupLocation: string;

  @IsNumber()
  @IsOptional()
  pickupLat?: number;

  @IsNumber()
  @IsOptional()
  pickupLng?: number;

  @IsString()
  dropoffLocation: string;

  @IsNumber()
  @IsOptional()
  dropoffLat?: number;

  @IsNumber()
  @IsOptional()
  dropoffLng?: number;

  @IsString()
  @IsOptional()
  specialRequests?: string;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;
}
