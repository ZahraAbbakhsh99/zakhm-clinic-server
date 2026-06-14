import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { JalaliDateUtil } from '../../common/utils/jalali';
import { NurseApplicationStatus } from '../entities/nurse-application.entity';

export class NurseApplicationResponseDto {
  @Expose() id: string;
  @Expose() fullName: string;
  @Expose() avatar?: string;
  @Expose() phone: string;
  @Expose() nationalCode: string;
  @Expose() degree?: string;
  @Expose() woundCareExperience?: string;
  @Expose() fieldExperience?: string;
  @Expose() province?: string;
  @Expose() city?: string;
  @Expose() address?: string;
  @Expose() medicalCouncilFile?: string;
  @Expose() status: NurseApplicationStatus;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(partial: Partial<NurseApplicationResponseDto>) {
    this.id = partial.id!;
    this.fullName = partial.fullName!;
    this.avatar = partial.avatar;
    this.phone = partial.phone!;
    this.nationalCode = partial.nationalCode!;
    this.degree = partial.degree;
    this.woundCareExperience = partial.woundCareExperience;
    this.fieldExperience = partial.fieldExperience;
    this.province = partial.province;
    this.city = partial.city;
    this.address = partial.address;
    this.medicalCouncilFile = partial.medicalCouncilFile;
    this.status = partial.status!;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
  }

  @Expose()
  @ApiProperty({ example: '۱۴۰۴/۲/۲۲' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jYYYY/jMM/jDD');
  }
}