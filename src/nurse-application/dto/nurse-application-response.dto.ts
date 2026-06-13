import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';
import { NurseApplicationStatus } from '../entities/nurse-application.entity';

export class NurseApplicationResponseDto {
  id!: string;
  fullName!: string;
  avatar?: string;
  phone!: string;
  nationalCode!: string;
  degree?: string;
  woundCareExperience?: string;
  fieldExperience?: string;
  province?: string;
  city?: string;
  address?: string;
  medicalCouncilFile?: string;
  status!: NurseApplicationStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<NurseApplicationResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jYYYY/jMM/jDD');
  }
}