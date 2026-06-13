import { DoctorStatus } from '../entities/doctor.entity';

export class DoctorResponseDto {
  id!: string;
  fullName!: string;
  avatar?: string;
  mobile?: string;
  nationalCode?: string;
  degree?: string;
  university?: string;
  woundCareExperience?: string;
  fieldExperience?: string;
  province?: string;
  city?: string;
  workAddress?: string;
  specialties?: string[];
  presenceDays?: string;
  presenceHours?: string;
  medicalCouncilFile?: string;
  bio?: string;
  status?: DoctorStatus;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<DoctorResponseDto>) {
    Object.assign(this, partial);
  }
}