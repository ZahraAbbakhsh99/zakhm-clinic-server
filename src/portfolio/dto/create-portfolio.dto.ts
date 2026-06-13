import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'درمان زخم دیابتی با روش جدید' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'توضیح کوتاه برای نمایش در کارت...' })
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiProperty({ example: 'توضیح کامل روند درمان...' })
  @IsString()
  @IsNotEmpty()
  treatmentProcess!: string;

  @ApiProperty({ example: 'https://bucket.liara.space/.../before.jpg' })
  @IsString()
  @IsNotEmpty()
  beforeImage!: string;

  @ApiProperty({ example: 'https://bucket.liara.space/.../after.jpg' })
  @IsString()
  @IsNotEmpty()
  afterImage!: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}