import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';
import { AppointmentStatus } from '../entities/appointment.entity';

export class AppointmentResponseDto {
  @Expose() id: string;
  @Expose() fullName: string;
  @Expose() phone: string;
  @Expose() categoryId: string;
  @Expose() categoryTitle: string;
  @Expose() description: string;
  @Expose() status: AppointmentStatus;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(partial: Partial<AppointmentResponseDto>) {
    this.id = partial.id!;
    this.fullName = partial.fullName!;
    this.phone = partial.phone!;
    this.categoryId = partial.categoryId!;
    this.categoryTitle = partial.categoryTitle!;
    this.description = partial.description!;
    this.status = partial.status!;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
  }

  @Expose()
  @ApiProperty({ example: '۱۴۰۴/۲/۲۲' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jYYYY/jMM/jDD');
  }

  @Expose()
  @ApiProperty({ example: '۱۴:۳۰' })
  get jalaliTime(): string {
    return JalaliDateUtil.toTime(this.createdAt);
  }
}