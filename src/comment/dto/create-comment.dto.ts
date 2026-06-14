import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateCommentDto {
  @ApiPropertyOptional({ example: 'general', enum: ['general', 'portfolio', 'testimonial_video'] })
  @IsOptional()
  @IsIn(['general', 'portfolio', 'testimonial_video'])
  entityType?: string;

  @ApiPropertyOptional({ example: 'uuid-of-portfolio' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({ example: 'علی رضایی' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'بسیار عالی بود، نتیجه درمان فوق‌العاده بود' })
  @IsString()
  @IsNotEmpty()
  comment!: string;
}