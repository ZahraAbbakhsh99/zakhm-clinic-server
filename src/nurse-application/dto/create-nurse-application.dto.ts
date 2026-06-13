import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsPhoneNumber, Length, IsUrl } from 'class-validator';

export class CreateNurseApplicationDto {
  @ApiProperty({ example: 'مریم حسینی' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiPropertyOptional({ example: 'https://bucket.liara.space/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ example: '09123456789' })
  @IsPhoneNumber('IR')
  phone!: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @Length(10, 10)
  nationalCode!: string;

  @ApiPropertyOptional({ example: 'کارشناسی پرستاری' })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({ example: '۳ سال سابقه در بخش زخم' })
  @IsOptional()
  @IsString()
  woundCareExperience?: string;

  @ApiPropertyOptional({ example: '۵ سال سابقه پرستاری داخلی' })
  @IsOptional()
  @IsString()
  fieldExperience?: string;

  @ApiPropertyOptional({ example: 'تهران' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'تهران' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'خیابان آزادی، پلاک ۱۲' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://bucket.liara.space/medical.pdf' })
  @IsOptional()
  @IsUrl()
  medicalCouncilFile?: string;
}