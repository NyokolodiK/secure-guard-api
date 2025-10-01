import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    example: 'SecureGuard Inc.',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Company description',
    example: 'Leading security services provider',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Company email address',
    example: 'contact@secureguard.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Company phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Company address',
    example: '123 Security St, Safe City, SC 12345',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Company logo URL',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Company verification status',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  verified?: boolean = false;
}
