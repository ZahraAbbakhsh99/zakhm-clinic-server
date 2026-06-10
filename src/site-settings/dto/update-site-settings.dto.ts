import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsObject } from 'class-validator';

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional({ example: '021-12345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '09123456789' })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ example: 'info@clinic.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'تهران، خیابان آزادی، پلاک ۱۲۳' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'شنبه تا چهارشنبه ۹-۱۸، پنجشنبه ۹-۱۳' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({
    example: { instagram: 'https://instagram.com/clinic', telegram: 'https://t.me/clinic', whatsapp: 'https://wa.me/123456789' },
    description: 'کلیدها: instagram, telegram, whatsapp',
  })
  @IsOptional()
  @IsObject()
  socialMedia?: Record<string, string>;
}