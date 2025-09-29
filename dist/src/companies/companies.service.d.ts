import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserType } from '@prisma/client';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            userType: import("@prisma/client").$Enums.UserType;
        }[];
        guards: {
            id: string;
            rating: number;
            firstName: string;
            lastName: string;
            status: import("@prisma/client").$Enums.GuardStatus;
        }[];
        _count: {
            bookings: number;
            reviews: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        email: string;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        rating: number;
        reviewCount: number;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        _count: {
            users: number;
            guards: number;
            bookings: number;
            reviews: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        email: string;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        rating: number;
        reviewCount: number;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        users: {
            id: string;
            email: string;
            phone: string | null;
            rating: number;
            firstName: string | null;
            lastName: string | null;
            profileImageUrl: string | null;
            userType: import("@prisma/client").$Enums.UserType;
        }[];
        guards: {
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
        }[];
        reviews: ({
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
        _count: {
            bookings: number;
            reviews: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        email: string;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        rating: number;
        reviewCount: number;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, userId?: string, userType?: UserType): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            userType: import("@prisma/client").$Enums.UserType;
        }[];
        guards: {
            id: string;
            rating: number;
            firstName: string;
            lastName: string;
            status: import("@prisma/client").$Enums.GuardStatus;
        }[];
        _count: {
            bookings: number;
            reviews: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        email: string;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        rating: number;
        reviewCount: number;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, userId?: string, userType?: UserType): Promise<{
        message: string;
    }>;
    getCompanyStats(id: string): Promise<{
        totalBookings: number;
        activeBookings: number;
        completedBookings: number;
        totalGuards: number;
        availableGuards: number;
        averageRating: number;
        totalReviews: number;
        totalRevenue: number;
    }>;
}
