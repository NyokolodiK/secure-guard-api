import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UserType, BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, clientId: string) {
    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        clientId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            logoUrl: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, userType?: UserType, companyId?: string) {
    const whereClause: Prisma.BookingWhereInput = {};

    // Filter based on user type and permissions
    if (userType === UserType.CLIENT) {
      whereClause.clientId = userId;
    } else if (userType === UserType.COMPANY_ADMIN && companyId) {
      whereClause.companyId = companyId;
    }
    // SYSTEM_ADMIN can see all bookings (no filter)

    return this.prisma.booking.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            logoUrl: true,
          },
        },
        bookingGuards: {
          include: {
            guard: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profileImageUrl: true,
                rating: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            guardLocations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    userId?: string,
    userType?: UserType,
    companyId?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            logoUrl: true,
          },
        },
        bookingGuards: {
          include: {
            guard: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profileImageUrl: true,
                bio: true,
                rating: true,
                reviewCount: true,
                status: true,
              },
            },
          },
        },
        guardLocations: {
          include: {
            guard: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            recordedAt: 'desc',
          },
          take: 50, // Last 50 location updates
        },
        companyReviews: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        guardReviews: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
            guard: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userType === UserType.CLIENT && booking.clientId !== userId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    if (
      userType === UserType.COMPANY_ADMIN &&
      booking.companyId !== companyId
    ) {
      throw new ForbiddenException(
        'You can only view bookings for your company',
      );
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId?: string,
    userType?: UserType,
    companyId?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userType === UserType.CLIENT) {
      if (booking.clientId !== userId) {
        throw new ForbiddenException('You can only update your own bookings');
      }
      // Clients can only update certain fields and only if booking is pending
      if (booking.status !== BookingStatus.PENDING) {
        throw new ForbiddenException('You can only update pending bookings');
      }
    }

    if (
      userType === UserType.COMPANY_ADMIN &&
      booking.companyId !== companyId
    ) {
      throw new ForbiddenException(
        'You can only update bookings for your company',
      );
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            logoUrl: true,
          },
        },
        bookingGuards: {
          include: {
            guard: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profileImageUrl: true,
                rating: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(
    id: string,
    userId?: string,
    userType?: UserType,
    companyId?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userType === UserType.CLIENT) {
      if (booking.clientId !== userId) {
        throw new ForbiddenException('You can only delete your own bookings');
      }
      // Clients can only delete pending bookings
      if (booking.status !== BookingStatus.PENDING) {
        throw new ForbiddenException('You can only delete pending bookings');
      }
    }

    if (
      userType === UserType.COMPANY_ADMIN &&
      booking.companyId !== companyId
    ) {
      throw new ForbiddenException(
        'You can only delete bookings for your company',
      );
    }

    await this.prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking deleted successfully' };
  }

  // Get bookings by status
  async findByStatus(
    status: BookingStatus,
    userId?: string,
    userType?: UserType,
    companyId?: string,
  ) {
    const whereClause: Prisma.BookingWhereInput = { status };

    if (userType === UserType.CLIENT) {
      whereClause.clientId = userId;
    } else if (userType === UserType.COMPANY_ADMIN && companyId) {
      whereClause.companyId = companyId;
    }

    return this.prisma.booking.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        bookingGuards: {
          include: {
            guard: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Assign guards to booking
  async assignGuards(
    bookingId: string,
    guardIds: string[],
    userId?: string,
    userType?: UserType,
    companyId?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only company admins can assign guards
    if (
      userType !== UserType.COMPANY_ADMIN &&
      userType !== UserType.SYSTEM_ADMIN
    ) {
      throw new ForbiddenException(
        'Only company administrators can assign guards',
      );
    }

    if (
      userType === UserType.COMPANY_ADMIN &&
      booking.companyId !== companyId
    ) {
      throw new ForbiddenException(
        'You can only assign guards to bookings for your company',
      );
    }

    // Remove existing guard assignments
    await this.prisma.bookingGuard.deleteMany({
      where: { bookingId },
    });

    // Create new assignments
    const assignments = guardIds.map((guardId) => ({
      bookingId,
      guardId,
    }));

    await this.prisma.bookingGuard.createMany({
      data: assignments,
    });

    return this.findOne(bookingId, userId, userType, companyId);
  }
}
