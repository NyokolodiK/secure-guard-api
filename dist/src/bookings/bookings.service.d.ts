import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UserType, BookingStatus } from '@prisma/client';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto, clientId: string): Promise<{
        company: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            logoUrl: string | null;
        };
        client: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        date: string;
        time: string;
        duration: number;
        numGuards: number;
        attire: import("@prisma/client").$Enums.Attire;
        vehicleType: string;
        pickupLocation: string;
        pickupLat: number | null;
        pickupLng: number | null;
        dropoffLocation: string;
        dropoffLat: number | null;
        dropoffLng: number | null;
        specialRequests: string | null;
        totalPrice: number | null;
        startTime: Date | null;
        endTime: Date | null;
        clientId: string;
    }>;
    findAll(userId?: string, userType?: UserType, companyId?: string): Promise<({
        company: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            logoUrl: string | null;
        };
        bookingGuards: ({
            guard: {
                id: string;
                email: string;
                phone: string | null;
                rating: number;
                firstName: string;
                lastName: string;
                profileImageUrl: string | null;
                status: import("@prisma/client").$Enums.GuardStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingGuardStatus;
            bookingId: string;
            guardId: string;
        })[];
        client: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
        };
        _count: {
            guardLocations: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        date: string;
        time: string;
        duration: number;
        numGuards: number;
        attire: import("@prisma/client").$Enums.Attire;
        vehicleType: string;
        pickupLocation: string;
        pickupLat: number | null;
        pickupLng: number | null;
        dropoffLocation: string;
        dropoffLat: number | null;
        dropoffLng: number | null;
        specialRequests: string | null;
        totalPrice: number | null;
        startTime: Date | null;
        endTime: Date | null;
        clientId: string;
    })[]>;
    findOne(id: string, userId?: string, userType?: UserType, companyId?: string): Promise<{
        company: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            address: string | null;
            logoUrl: string | null;
        };
        companyReviews: ({
            client: {
                firstName: string | null;
                lastName: string | null;
                profileImageUrl: string | null;
            };
        } & {
            id: string;
            rating: number;
            createdAt: Date;
            companyId: string;
            clientId: string;
            comment: string | null;
            bookingId: string;
        })[];
        guardReviews: ({
            guard: {
                firstName: string;
                lastName: string;
            };
            client: {
                firstName: string | null;
                lastName: string | null;
                profileImageUrl: string | null;
            };
        } & {
            id: string;
            rating: number;
            createdAt: Date;
            clientId: string;
            comment: string | null;
            bookingId: string;
            guardId: string;
        })[];
        bookingGuards: ({
            guard: {
                id: string;
                email: string;
                phone: string | null;
                rating: number;
                reviewCount: number;
                firstName: string;
                lastName: string;
                profileImageUrl: string | null;
                bio: string | null;
                status: import("@prisma/client").$Enums.GuardStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingGuardStatus;
            bookingId: string;
            guardId: string;
        })[];
        guardLocations: ({
            guard: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            bookingId: string;
            guardId: string;
            recordedAt: Date;
            latitude: number;
            longitude: number;
        })[];
        client: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            profileImageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        date: string;
        time: string;
        duration: number;
        numGuards: number;
        attire: import("@prisma/client").$Enums.Attire;
        vehicleType: string;
        pickupLocation: string;
        pickupLat: number | null;
        pickupLng: number | null;
        dropoffLocation: string;
        dropoffLat: number | null;
        dropoffLng: number | null;
        specialRequests: string | null;
        totalPrice: number | null;
        startTime: Date | null;
        endTime: Date | null;
        clientId: string;
    }>;
    update(id: string, updateBookingDto: UpdateBookingDto, userId?: string, userType?: UserType, companyId?: string): Promise<{
        company: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            logoUrl: string | null;
        };
        bookingGuards: ({
            guard: {
                id: string;
                email: string;
                phone: string | null;
                rating: number;
                firstName: string;
                lastName: string;
                profileImageUrl: string | null;
                status: import("@prisma/client").$Enums.GuardStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingGuardStatus;
            bookingId: string;
            guardId: string;
        })[];
        client: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        date: string;
        time: string;
        duration: number;
        numGuards: number;
        attire: import("@prisma/client").$Enums.Attire;
        vehicleType: string;
        pickupLocation: string;
        pickupLat: number | null;
        pickupLng: number | null;
        dropoffLocation: string;
        dropoffLat: number | null;
        dropoffLng: number | null;
        specialRequests: string | null;
        totalPrice: number | null;
        startTime: Date | null;
        endTime: Date | null;
        clientId: string;
    }>;
    remove(id: string, userId?: string, userType?: UserType, companyId?: string): Promise<{
        message: string;
    }>;
    findByStatus(status: BookingStatus, userId?: string, userType?: UserType, companyId?: string): Promise<({
        company: {
            id: string;
            name: string;
            logoUrl: string | null;
        };
        bookingGuards: ({
            guard: {
                id: string;
                firstName: string;
                lastName: string;
                status: import("@prisma/client").$Enums.GuardStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingGuardStatus;
            bookingId: string;
            guardId: string;
        })[];
        client: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        date: string;
        time: string;
        duration: number;
        numGuards: number;
        attire: import("@prisma/client").$Enums.Attire;
        vehicleType: string;
        pickupLocation: string;
        pickupLat: number | null;
        pickupLng: number | null;
        dropoffLocation: string;
        dropoffLat: number | null;
        dropoffLng: number | null;
        specialRequests: string | null;
        totalPrice: number | null;
        startTime: Date | null;
        endTime: Date | null;
        clientId: string;
    })[]>;
    assignGuards(bookingId: string, guardIds: string[], userId?: string, userType?: UserType, companyId?: string): Promise<{
        company: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            address: string | null;
            logoUrl: string | null;
        };
        companyReviews: ({
            client: {
                firstName: string | null;
                lastName: string | null;
                profileImageUrl: string | null;
            };
        } & {
            id: string;
            rating: number;
            createdAt: Date;
            companyId: string;
            clientId: string;
            comment: string | null;
            bookingId: string;
        })[];
        guardReviews: ({
            guard: {
                firstName: string;
                lastName: string;
            };
            client: {
                firstName: string | null;
                lastName: string | null;
                profileImageUrl: string | null;
            };
        } & {
            id: string;
            rating: number;
            createdAt: Date;
            clientId: string;
            comment: string | null;
            bookingId: string;
            guardId: string;
        })[];
        bookingGuards: ({
            guard: {
                id: string;
                email: string;
                phone: string | null;
                rating: number;
                reviewCount: number;
                firstName: string;
                lastName: string;
                profileImageUrl: string | null;
                bio: string | null;
                status: import("@prisma/client").$Enums.GuardStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingGuardStatus;
            bookingId: string;
            guardId: string;
        })[];
        guardLocations: ({
            guard: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            bookingId: string;
            guardId: string;
            recordedAt: Date;
            latitude: number;
            longitude: number;
        })[];
        client: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            profileImageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        date: string;
        time: string;
        duration: number;
        numGuards: number;
        attire: import("@prisma/client").$Enums.Attire;
        vehicleType: string;
        pickupLocation: string;
        pickupLat: number | null;
        pickupLng: number | null;
        dropoffLocation: string;
        dropoffLat: number | null;
        dropoffLng: number | null;
        specialRequests: string | null;
        totalPrice: number | null;
        startTime: Date | null;
        endTime: Date | null;
        clientId: string;
    }>;
}
