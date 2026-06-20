import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class GetPresignedUrlDto {
  @ApiProperty({ description: 'نام فایل به همراه پسوند', example: 'my-video.mp4' })
  @IsString()
  fileName!: string;

  @ApiProperty({ description: 'نوع فایل', enum: ['image', 'video', 'file'] })
  @IsIn(['image', 'video', 'file'])
  type!: 'image' | 'video' | 'file';
}