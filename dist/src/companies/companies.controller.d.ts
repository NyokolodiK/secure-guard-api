import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { type User } from '@prisma/client';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
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
    getStats(id: string): Promise<{
        totalBookings: number;
        activeBookings: number;
        completedBookings: number;
        totalGuards: number;
        availableGuards: number;
        averageRating: number;
        totalReviews: number;
        totalRevenue: number;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, user: User): Promise<{
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
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
}
