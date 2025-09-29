import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../types/jwt-payload.type';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<Partial<{
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
    }>>;
}
export {};
