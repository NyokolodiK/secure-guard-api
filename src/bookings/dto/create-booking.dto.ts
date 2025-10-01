import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Attire } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Company ID providing the security service',
    example: 'company-uuid-here',
  })
  @IsString()
  companyId: string;

  @ApiProperty({
    description: 'Booking date (YYYY-MM-DD format)',
    example: '2024-12-25',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'Booking time (HH:MM format)',
    example: '14:30',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Duration in hours',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({
    description: 'Number of guards required',
    example: 2,
    default: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  numGuards?: number = 1;

  @ApiPropertyOptional({
    description: 'Guard attire requirement',
    enum: Attire,
    default: Attire.SUIT,
    example: Attire.SUIT,
  })
  @IsEnum(Attire)
  @IsOptional()
  attire?: Attire = Attire.SUIT;

  @ApiProperty({
    description: 'Type of vehicle required',
    example: 'SUV',
  })
  @IsString()
  vehicleType: string;

  @ApiProperty({
    description: 'Pickup location address',
    example: '123 Main St, City, State 12345',
  })
  @IsString()
  pickupLocation: string;

  @ApiPropertyOptional({
    description: 'Pickup location latitude',
    example: 40.7128,
  })
  @IsNumber()
  @IsOptional()
  pickupLat?: number;

  @ApiPropertyOptional({
    description: 'Pickup location longitude',
    example: -74.0060,
  })
  @IsNumber()
  @IsOptional()
  pickupLng?: number;

  @ApiProperty({
    description: 'Dropoff location address',
    example: '456 Oak Ave, City, State 12345',
  })
  @IsString()
  dropoffLocation: string;

  @ApiPropertyOptional({
    description: 'Dropoff location latitude',
    example: 40.7589,
  })
  @IsNumber()
  @IsOptional()
  dropoffLat?: number;

  @ApiPropertyOptional({
    description: 'Dropoff location longitude',
    example: -73.9851,
  })
  @IsNumber()
  @IsOptional()
  dropoffLng?: number;

  @ApiPropertyOptional({
    description: 'Special requests or instructions',
    example: 'VIP client, extra security measures required',
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Total price for the booking',
    example: 500.00,
  })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;
}
