import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'زخم دیابتی' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'diabetic-wound' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiPropertyOptional({})
  @IsString()
  @IsOptional()
  description?: string;
}