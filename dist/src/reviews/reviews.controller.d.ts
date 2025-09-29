import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { type User } from '@prisma/client';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, user: User): Promise<({
        company: {
            name: string;
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
        companyId: string;
        clientId: string;
        comment: string | null;
        bookingId: string;
    }) | ({
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
    })>;
    getCompanyReviews(companyId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            client: {
                firstName: string | null;
                lastName: string | null;
                profileImageUrl: string | null;
            };
            booking: {
                date: string;
                time: string;
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
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getGuardReviews(guardId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            client: {
                firstName: string | null;
                lastName: string | null;
                profileImageUrl: string | null;
            };
            booking: {
                date: string;
                time: string;
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
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserReviews(user: User): Promise<{
        companyReviews: ({
            company: {
                name: string;
                logoUrl: string | null;
            };
            booking: {
                date: string;
                time: string;
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
                profileImageUrl: string | null;
            };
            booking: {
                date: string;
                time: string;
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
    }>;
}
