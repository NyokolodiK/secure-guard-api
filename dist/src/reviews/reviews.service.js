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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createReviewDto, clientId) {
        const { bookingId, type, guardId, rating, comment } = createReviewDto;
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
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.clientId !== clientId) {
            throw new common_1.ForbiddenException('You can only review your own bookings');
        }
        if (booking.status !== client_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('You can only review completed bookings');
        }
        if (type === create_review_dto_1.ReviewType.COMPANY) {
            const existingReview = await this.prisma.companyReview.findFirst({
                where: {
                    bookingId,
                    clientId,
                },
            });
            if (existingReview) {
                throw new common_1.BadRequestException('You have already reviewed this company for this booking');
            }
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
            await this.updateCompanyRating(booking.companyId);
            return review;
        }
        else if (type === create_review_dto_1.ReviewType.GUARD) {
            if (!guardId) {
                throw new common_1.BadRequestException('Guard ID is required for guard reviews');
            }
            const guardAssignment = booking.bookingGuards.find((bg) => bg.guardId === guardId);
            if (!guardAssignment) {
                throw new common_1.BadRequestException('This guard was not assigned to this booking');
            }
            const existingReview = await this.prisma.guardReview.findFirst({
                where: {
                    bookingId,
                    guardId,
                    clientId,
                },
            });
            if (existingReview) {
                throw new common_1.BadRequestException('You have already reviewed this guard for this booking');
            }
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
            await this.updateGuardRating(guardId);
            return review;
        }
        throw new common_1.BadRequestException('Invalid review type');
    }
    async getCompanyReviews(companyId, page = 1, limit = 10) {
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
    async getGuardReviews(guardId, page = 1, limit = 10) {
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
    async getUserReviews(clientId) {
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
    async updateCompanyRating(companyId) {
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
    async updateGuardRating(guardId) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map