import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, IsEnum } from 'class-validator';
import { DoctorStatus } from '../entities/doctor.entity';

export class CreateDoctorDto {
  @ApiProperty({ example: 'علی رضایی' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiPropertyOptional({ example: 'https://bucket.liara.space/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ example: '09123456789' })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  nationalCode?: string;

  @ApiPropertyOptional({ example: 'دکتری تخصصی جراحی' })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({ example: 'دانشگاه علوم پزشکی تهران' })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiPropertyOptional({ example: '۱۰ سال سابقه در درمان زخم‌های دیابتی' })
  @IsOptional()
  @IsString()
  woundCareExperience?: string;

  @ApiPropertyOptional({ example: '۱۵ سال سابقه جراحی عمومی' })
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

  @ApiPropertyOptional({ example: 'خیابان آزادی، پلاک ۱۲۳' })
  @IsOptional()
  @IsString()
  workAddress?: string;

  @ApiPropertyOptional({ example: ['زخم دیابتی', 'زخم فشاری', 'سوختگی'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiPropertyOptional({ example: 'شنبه تا چهارشنبه' })
  @IsOptional()
  @IsString()
  presenceDays?: string;

  @ApiPropertyOptional({ example: '۹ صبح تا ۱۸ عصر' })
  @IsOptional()
  @IsString()
  presenceHours?: string;

  @ApiPropertyOptional({ example: 'https://bucket.liara.space/medical.pdf' })
  @IsOptional()
  @IsUrl()
  medicalCouncilFile?: string;

  @ApiPropertyOptional({ example: 'بیوگرافی دکتر...' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ enum: DoctorStatus, default: DoctorStatus.PENDING })
  @IsOptional()
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;
}