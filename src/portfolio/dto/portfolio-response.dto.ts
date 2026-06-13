import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';

export class PortfolioResponseDto {
  id!: string;
  title!: string;
  shortDescription!: string;
  treatmentProcess!: string;
  beforeImage!: string;
  afterImage!: string;
  categoryId!: string;
  categoryTitle!: string;         
  commentCount?: number;          
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<PortfolioResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jDD jMMMM jYYYY');
  }
}