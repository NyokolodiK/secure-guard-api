import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
