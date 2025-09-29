import { UserType } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImageUrl?: string;
    userType?: UserType;
    companyId?: string;
}
