import { UserType } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    userType?: UserType;
    companyId?: string;
}
