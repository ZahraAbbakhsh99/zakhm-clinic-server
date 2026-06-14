import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';
import { ArticleStatus } from '../entities/article.entity';

export class ArticleResponseDto {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() content?: string;
  @Expose() image: string;
  @Expose() status: ArticleStatus;
  @Expose() categoryId: string;
  @Expose() categoryTitle: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(partial: Partial<ArticleResponseDto>) {
    this.id = partial.id!;
    this.title = partial.title!;
    this.content = partial.content;
    this.image = partial.image!;
    this.status = partial.status!;
    this.categoryId = partial.categoryId!;
    this.categoryTitle = partial.categoryTitle!;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
  }

  @Expose()
  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jDD jMMMM jYYYY');
  }
}