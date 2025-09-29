import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        phone: string | null;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        company: {
            id: string;
            name: string;
            logoUrl: string | null;
        } | null;
        firstName: string | null;
        lastName: string | null;
        profileImageUrl: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        companyId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        company: {
            id: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
            verified: boolean;
        } | null;
        firstName: string | null;
        lastName: string | null;
        profileImageUrl: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        userPreferences: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            key: string;
            value: string;
        }[];
        companyId: string | null;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        phone: string | null;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string | null;
        lastName: string | null;
        profileImageUrl: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        companyId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getUserPreferences(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        key: string;
        value: string;
    }[]>;
    setUserPreference(userId: string, key: string, value: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        key: string;
        value: string;
    }>;
    deleteUserPreference(userId: string, key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        key: string;
        value: string;
    }>;
}
