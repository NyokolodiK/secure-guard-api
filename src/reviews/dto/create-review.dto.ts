import { IsString, IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator';

export enum ReviewType {
  COMPANY = 'company',
  GUARD = 'guard',
}

export class CreateReviewDto {
  @IsString()
  bookingId: string;

  @IsEnum(ReviewType)
  type: ReviewType;

  @IsString()
  @IsOptional()
  guardId?: string; // Required if type is 'guard'

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
