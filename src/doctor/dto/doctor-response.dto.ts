import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DoctorStatus } from '../entities/doctor.entity';
import { JalaliDateUtil } from '../../common/utils/jalali';

export class DoctorResponseDto {
  @Expose() id: string;
  @Expose() fullName: string;
  @Expose() avatar?: string;
  @Expose() mobile?: string;
  @Expose() nationalCode?: string;
  @Expose() degree?: string;
  @Expose() university?: string;
  @Expose() woundCareExperience?: string;
  @Expose() fieldExperience?: string;
  @Expose() province?: string;
  @Expose() city?: string;
  @Expose() workAddress?: string;
  @Expose() specialties?: string[];
  @Expose() presenceDays?: string;
  @Expose() presenceHours?: string;
  @Expose() medicalCouncilFile?: string;
  @Expose() bio?: string;
  @Expose() status?: DoctorStatus;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(partial: Partial<DoctorResponseDto>) {
    this.id = partial.id!;
    this.fullName = partial.fullName!;
    this.avatar = partial.avatar;
    this.mobile = partial.mobile;
    this.nationalCode = partial.nationalCode;
    this.degree = partial.degree;
    this.university = partial.university;
    this.woundCareExperience = partial.woundCareExperience;
    this.fieldExperience = partial.fieldExperience;
    this.province = partial.province;
    this.city = partial.city;
    this.workAddress = partial.workAddress;
    this.specialties = partial.specialties;
    this.presenceDays = partial.presenceDays;
    this.presenceHours = partial.presenceHours;
    this.medicalCouncilFile = partial.medicalCouncilFile;
    this.bio = partial.bio;
    this.status = partial.status;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
  }

  @Expose()
  @ApiProperty({ example: '۲۲ مهر ۱۴۰۴' })
  get jalaliDate(): string {
    return JalaliDateUtil.toJalali(this.createdAt, 'jDD jMMMM jYYYY');
  }
}