import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsIn } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'portfolio', enum: ['portfolio', 'testimonial_video'] })
  @IsIn(['portfolio', 'testimonial_video'])
  entityType!: string;

  @ApiProperty({ example: 'uuid-of-portfolio' })
  @IsString()
  @IsNotEmpty()
  entityId!: string;

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