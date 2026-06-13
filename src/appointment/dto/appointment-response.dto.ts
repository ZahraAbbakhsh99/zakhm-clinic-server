import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';
import { AppointmentStatus } from '../entities/appointment.entity';

export class AppointmentResponseDto {
  id!: string;
  fullName!: string;
  phone!: string;
  categoryId!: string;
  categoryTitle!: string;
  description!: string;
  status!: AppointmentStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<AppointmentResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jYYYY/jMM/jDD');
  }

  @ApiProperty({ example: '۱۴:۳۰' })
  get jalaliTime(): string {
    return JalaliDateUtil.toTime(this.createdAt);
  }
}