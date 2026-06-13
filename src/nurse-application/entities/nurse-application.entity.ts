import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NurseApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('nurse_applications')
export class NurseApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column()
  phone!: string;

  @Column({ name: 'national_code', unique: true })
  nationalCode!: string;

  @Column({ nullable: true })
  degree!: string;

  @Column({ name: 'wound_care_experience', type: 'text', nullable: true })
  woundCareExperience!: string;

  @Column({ name: 'field_experience', type: 'text', nullable: true })
  fieldExperience!: string;

  @Column({ nullable: true })
  province!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ type: 'text', nullable: true })
  address!: string;

  @Column({ name: 'medical_council_file', nullable: true })
  medicalCouncilFile!: string;

  @Column({ type: 'enum', enum: NurseApplicationStatus, default: NurseApplicationStatus.PENDING })
  status!: NurseApplicationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}