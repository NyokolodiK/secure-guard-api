import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType;

  @IsString()
  @IsOptional()
  companyId?: string;
}
