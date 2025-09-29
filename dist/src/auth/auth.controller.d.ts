import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { User } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
        };
    }>;
    login(loginDto: LoginDto, ipAddress: string, userAgent: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
            isEmailVerified: boolean;
            companyId: string | null;
        };
    }>;
    logout(user: User, authHeader: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(user: User): {
        user: {
            id: string;
            email: string;
            phone: string | null;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            firstName: string | null;
            lastName: string | null;
            profileImageUrl: string | null;
            userType: import("@prisma/client").$Enums.UserType;
            isEmailVerified: boolean;
            companyId: string | null;
        };
    };
}
