import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DoctorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column({ nullable: true })
  mobile!: string;

  @Column({ name: 'national_code', unique: true, nullable: true })
  nationalCode!: string;

  @Column({ nullable: true })
  degree!: string;

  @Column({ nullable: true })
  university!: string;

  @Column({ name: 'wound_care_experience', type: 'text', nullable: true })
  woundCareExperience!: string;

  @Column({ name: 'field_experience', type: 'text', nullable: true })
  fieldExperience!: string;

  @Column({ nullable: true })
  province!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ name: 'work_address', type: 'text', nullable: true })
  workAddress!: string;

  @Column({ type: 'simple-array', nullable: true })
  specialties!: string[];

  @Column({ name: 'presence_days', nullable: true })
  presenceDays!: string;

  @Column({ name: 'presence_hours', nullable: true })
  presenceHours!: string;

  @Column({ name: 'medical_council_file', nullable: true })
  medicalCouncilFile!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string;

  @Column({ type: 'enum', enum: DoctorStatus, default: DoctorStatus.PENDING })
  status!: DoctorStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}