export declare enum ReviewType {
    COMPANY = "company",
    GUARD = "guard"
}
export declare class CreateReviewDto {
    bookingId: string;
    type: ReviewType;
    guardId?: string;
    rating: number;
    comment?: string;
}
