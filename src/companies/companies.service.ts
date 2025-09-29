import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            userType: true,
          },
        },
        guards: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            rating: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            guards: true,
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            userType: true,
            phone: true,
            profileImageUrl: true,
            rating: true,
          },
        },
        guards: {
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
        reviews: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userId?: string,
    userType?: UserType,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Check permissions
    if (userType !== UserType.SYSTEM_ADMIN) {
      const isCompanyAdmin = company.users.some(
        (user) =>
          user.id === userId && user.userType === UserType.COMPANY_ADMIN,
      );

      if (!isCompanyAdmin) {
        throw new ForbiddenException(
          'You do not have permission to update this company',
        );
      }
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            userType: true,
          },
        },
        guards: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            rating: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId?: string, userType?: UserType) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Only system admin can delete companies
    if (userType !== UserType.SYSTEM_ADMIN) {
      throw new ForbiddenException(
        'Only system administrators can delete companies',
      );
    }

    await this.prisma.company.delete({
      where: { id },
    });

    return { message: 'Company deleted successfully' };
  }

  async getCompanyStats(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const stats = await this.prisma.$transaction([
      // Total bookings
      this.prisma.booking.count({
        where: { companyId: id },
      }),
      // Active bookings
      this.prisma.booking.count({
        where: {
          companyId: id,
          status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
        },
      }),
      // Completed bookings
      this.prisma.booking.count({
        where: {
          companyId: id,
          status: 'COMPLETED',
        },
      }),
      // Total guards
      this.prisma.guard.count({
        where: { companyId: id },
      }),
      // Available guards
      this.prisma.guard.count({
        where: {
          companyId: id,
          status: 'AVAILABLE',
        },
      }),
      // Average rating
      this.prisma.companyReview.aggregate({
        where: { companyId: id },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      // Revenue (sum of completed bookings)
      this.prisma.booking.aggregate({
        where: {
          companyId: id,
          status: 'COMPLETED',
        },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalBookings: stats[0],
      activeBookings: stats[1],
      completedBookings: stats[2],
      totalGuards: stats[3],
      availableGuards: stats[4],
      averageRating: stats[5]._avg.rating || 0,
      totalReviews: stats[5]._count.rating,
      totalRevenue: stats[6]._sum.totalPrice || 0,
    };
  }
}
