import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';
import { ArticleStatus } from '../entities/article.entity';

export class ArticleResponseDto {
  id!: string;
  title!: string;
  content?: string; 
  image!: string;
  status!: ArticleStatus;
  categoryId!: string;
  categoryTitle!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ArticleResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jDD jMMMM jYYYY');
  }
}