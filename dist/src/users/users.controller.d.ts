import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    getProfile(user: User): Promise<{
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
    updateProfile(user: User, updateUserDto: UpdateUserDto): Promise<{
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
    getUserPreferences(user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        key: string;
        value: string;
    }[]>;
    setUserPreference(user: User, body: {
        key: string;
        value: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        key: string;
        value: string;
    }>;
    deleteUserPreference(user: User, key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        key: string;
        value: string;
    }>;
}
