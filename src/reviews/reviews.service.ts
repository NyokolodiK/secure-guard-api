import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, ReviewType } from './dto/create-review.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, clientId: string) {
    const { bookingId, type, guardId, rating, comment } = createReviewDto;

    // Verify booking exists and belongs to client
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        company: true,
        bookingGuards: {
          include: {
            guard: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== clientId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('You can only review completed bookings');
    }

    if (type === ReviewType.COMPANY) {
      // Check if company review already exists
      const existingReview = await this.prisma.companyReview.findFirst({
        where: {
          bookingId,
          clientId,
        },
      });

      if (existingReview) {
        throw new BadRequestException(
          'You have already reviewed this company for this booking',
        );
      }

      // Create company review
      const review = await this.prisma.companyReview.create({
        data: {
          bookingId,
          companyId: booking.companyId,
          clientId,
          rating,
          comment,
        },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      // Update company rating
      await this.updateCompanyRating(booking.companyId);

      return review;
    } else if (type === ReviewType.GUARD) {
      if (!guardId) {
        throw new BadRequestException('Guard ID is required for guard reviews');
      }

      // Verify guard was assigned to this booking
      const guardAssignment = booking.bookingGuards.find(
        (bg) => bg.guardId === guardId,
      );
      if (!guardAssignment) {
        throw new BadRequestException(
          'This guard was not assigned to this booking',
        );
      }

      // Check if guard review already exists
      const existingReview = await this.prisma.guardReview.findFirst({
        where: {
          bookingId,
          guardId,
          clientId,
        },
      });

      if (existingReview) {
        throw new BadRequestException(
          'You have already reviewed this guard for this booking',
        );
      }

      // Create guard review
      const review = await this.prisma.guardReview.create({
        data: {
          bookingId,
          guardId,
          clientId,
          rating,
          comment,
        },
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
      });

      // Update guard rating
      await this.updateGuardRating(guardId);

      return review;
    }

    throw new BadRequestException('Invalid review type');
  }

  async getCompanyReviews(
    companyId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.companyReview.findMany({
        where: { companyId },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          booking: {
            select: {
              date: true,
              time: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.companyReview.count({
        where: { companyId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getGuardReviews(guardId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.guardReview.findMany({
        where: { guardId },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          booking: {
            select: {
              date: true,
              time: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.guardReview.count({
        where: { guardId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserReviews(clientId: string) {
    const [companyReviews, guardReviews] = await Promise.all([
      this.prisma.companyReview.findMany({
        where: { clientId },
        include: {
          company: {
            select: {
              name: true,
              logoUrl: true,
            },
          },
          booking: {
            select: {
              date: true,
              time: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.guardReview.findMany({
        where: { clientId },
        include: {
          guard: {
            select: {
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          booking: {
            select: {
              date: true,
              time: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      companyReviews,
      guardReviews,
    };
  }

  private async updateCompanyRating(companyId: string) {
    const result = await this.prisma.companyReview.aggregate({
      where: { companyId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        rating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }

  private async updateGuardRating(guardId: string) {
    const result = await this.prisma.guardReview.aggregate({
      where: { guardId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.guard.update({
      where: { id: guardId },
      data: {
        rating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }
}
