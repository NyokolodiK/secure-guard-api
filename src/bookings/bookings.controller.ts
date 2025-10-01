import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Client access required' })
  @UseGuards(RolesGuard)
  @Roles(UserType.CLIENT)
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for current user' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  findAll(@CurrentUser() user: User) {
    return this.bookingsService.findAll(
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get bookings by status' })
  @ApiParam({ name: 'status', description: 'Booking status' })
  @ApiResponse({ status: 200, description: 'List of bookings with specified status' })
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
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(
      id,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
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
  @ApiOperation({ summary: 'Delete booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.remove(
      id,
      user.id,
      user.userType,
      user.companyId ?? undefined,
    );
  }

  @Post(':id/assign-guards')
  @ApiOperation({ summary: 'Assign guards to booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        guardIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of guard IDs to assign',
          example: ['guard-id-1', 'guard-id-2'],
        },
      },
      required: ['guardIds'],
    },
  })
  @ApiResponse({ status: 200, description: 'Guards assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
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
