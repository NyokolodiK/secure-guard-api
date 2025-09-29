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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto, clientId) {
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
    async findAll(userId, userType, companyId) {
        const whereClause = {};
        if (userType === client_1.UserType.CLIENT) {
            whereClause.clientId = userId;
        }
        else if (userType === client_1.UserType.COMPANY_ADMIN && companyId) {
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
    async findOne(id, userId, userType, companyId) {
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
                    take: 50,
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
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userType === client_1.UserType.CLIENT && booking.clientId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own bookings');
        }
        if (userType === client_1.UserType.COMPANY_ADMIN &&
            booking.companyId !== companyId) {
            throw new common_1.ForbiddenException('You can only view bookings for your company');
        }
        return booking;
    }
    async update(id, updateBookingDto, userId, userType, companyId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userType === client_1.UserType.CLIENT) {
            if (booking.clientId !== userId) {
                throw new common_1.ForbiddenException('You can only update your own bookings');
            }
            if (booking.status !== client_1.BookingStatus.PENDING) {
                throw new common_1.ForbiddenException('You can only update pending bookings');
            }
        }
        if (userType === client_1.UserType.COMPANY_ADMIN &&
            booking.companyId !== companyId) {
            throw new common_1.ForbiddenException('You can only update bookings for your company');
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
    async remove(id, userId, userType, companyId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userType === client_1.UserType.CLIENT) {
            if (booking.clientId !== userId) {
                throw new common_1.ForbiddenException('You can only delete your own bookings');
            }
            if (booking.status !== client_1.BookingStatus.PENDING) {
                throw new common_1.ForbiddenException('You can only delete pending bookings');
            }
        }
        if (userType === client_1.UserType.COMPANY_ADMIN &&
            booking.companyId !== companyId) {
            throw new common_1.ForbiddenException('You can only delete bookings for your company');
        }
        await this.prisma.booking.delete({
            where: { id },
        });
        return { message: 'Booking deleted successfully' };
    }
    async findByStatus(status, userId, userType, companyId) {
        const whereClause = { status };
        if (userType === client_1.UserType.CLIENT) {
            whereClause.clientId = userId;
        }
        else if (userType === client_1.UserType.COMPANY_ADMIN && companyId) {
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
    async assignGuards(bookingId, guardIds, userId, userType, companyId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userType !== client_1.UserType.COMPANY_ADMIN &&
            userType !== client_1.UserType.SYSTEM_ADMIN) {
            throw new common_1.ForbiddenException('Only company administrators can assign guards');
        }
        if (userType === client_1.UserType.COMPANY_ADMIN &&
            booking.companyId !== companyId) {
            throw new common_1.ForbiddenException('You can only assign guards to bookings for your company');
        }
        await this.prisma.bookingGuard.deleteMany({
            where: { bookingId },
        });
        const assignments = guardIds.map((guardId) => ({
            bookingId,
            guardId,
        }));
        await this.prisma.bookingGuard.createMany({
            data: assignments,
        });
        return this.findOne(bookingId, userId, userType, companyId);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map