import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateTestimonialVideoDto {
  @ApiProperty({ example: 'رضایت درمان' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'بعد از درمان در کلینیک ما، زندگی من تغییر کرد...' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'https://bucket.liara.space/clinic-files/videos/xxx.mp4' })
  @IsUrl()
  @IsNotEmpty()
  videoUrl!: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}