"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Company not found');
        }
        return company;
    }
    async update(id, updateCompanyDto, userId, userType) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                users: true,
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        if (userType !== client_1.UserType.SYSTEM_ADMIN) {
            const isCompanyAdmin = company.users.some((user) => user.id === userId && user.userType === client_1.UserType.COMPANY_ADMIN);
            if (!isCompanyAdmin) {
                throw new common_1.ForbiddenException('You do not have permission to update this company');
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
    async remove(id, userId, userType) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                users: true,
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        if (userType !== client_1.UserType.SYSTEM_ADMIN) {
            throw new common_1.ForbiddenException('Only system administrators can delete companies');
        }
        await this.prisma.company.delete({
            where: { id },
        });
        return { message: 'Company deleted successfully' };
    }
    async getCompanyStats(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const stats = await this.prisma.$transaction([
            this.prisma.booking.count({
                where: { companyId: id },
            }),
            this.prisma.booking.count({
                where: {
                    companyId: id,
                    status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
                },
            }),
            this.prisma.booking.count({
                where: {
                    companyId: id,
                    status: 'COMPLETED',
                },
            }),
            this.prisma.guard.count({
                where: { companyId: id },
            }),
            this.prisma.guard.count({
                where: {
                    companyId: id,
                    status: 'AVAILABLE',
                },
            }),
            this.prisma.companyReview.aggregate({
                where: { companyId: id },
                _avg: { rating: true },
                _count: { rating: true },
            }),
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
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map