import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  @ApiProperty({ example: '10 راهکار برای درمان زخم دیابتی' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'متن کامل مقاله...' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 'https://bucket.liara.space/.../image.jpg' })
  @IsString()
  @IsNotEmpty()
  image!: string;

  @ApiProperty({ enum: ArticleStatus, example: ArticleStatus.DRAFT })
  @IsEnum(ArticleStatus)
  status!: ArticleStatus;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}