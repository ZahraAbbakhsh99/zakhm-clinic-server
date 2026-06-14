import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';

export class PortfolioResponseDto {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() shortDescription: string;
  @Expose() treatmentProcess: string;
  @Expose() beforeImage: string;
  @Expose() afterImage: string;
  @Expose() categoryId: string;
  @Expose() categoryTitle: string;
  @Expose() commentCount?: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(partial: Partial<PortfolioResponseDto>) {
    this.id = partial.id!;
    this.title = partial.title!;
    this.shortDescription = partial.shortDescription!;
    this.treatmentProcess = partial.treatmentProcess!;
    this.beforeImage = partial.beforeImage!;
    this.afterImage = partial.afterImage!;
    this.categoryId = partial.categoryId!;
    this.categoryTitle = partial.categoryTitle!;
    this.commentCount = partial.commentCount;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
  }

  @Expose()
  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jDD jMMMM jYYYY');
  }
}