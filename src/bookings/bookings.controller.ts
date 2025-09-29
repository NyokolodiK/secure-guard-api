import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserType } from '@prisma/client';
import type { User, BookingStatus } from '@prisma/client';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserType.CLIENT)
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.bookingsService.findAll(
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Get('status/:status')
  findByStatus(
    @Param('status') status: BookingStatus,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.findByStatus(
      status,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(
      id,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.update(
      id,
      updateBookingDto,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.remove(
      id,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Post(':id/assign-guards')
  @UseGuards(RolesGuard)
  @Roles(UserType.COMPANY_ADMIN, UserType.SYSTEM_ADMIN)
  assignGuards(
    @Param('id') id: string,
    @Body('guardIds') guardIds: string[],
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.assignGuards(
      id,
      guardIds,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }
}
