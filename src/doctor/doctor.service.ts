import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor, DoctorStatus } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private uploadService: UploadService,
  ) {}

  async create(createDto: CreateDoctorDto): Promise<Doctor> {
    if (createDto.nationalCode) {
      const existing = await this.doctorRepository.findOne({ where: { nationalCode: createDto.nationalCode } });
      if (existing) throw new ConflictException('کد ملی قبلاً ثبت شده است');
    }
    const doctor = this.doctorRepository.create(createDto);
    return this.doctorRepository.save(doctor);
  }

  async findAllAdmin(
    page: number,
    limit: number,
    search?: string,
    status?: DoctorStatus,
  ): Promise<{ items: Partial<DoctorResponseDto>[]; total: number }> {
    const qb = this.doctorRepository.createQueryBuilder('d');

    if (search) {
      qb.andWhere(
        '(d.fullName LIKE :search OR d.specialties LIKE :search)',
        { search: `%${search}%` }
      );
    }
    if (status) {
      qb.andWhere('d.status = :status', { status });
    }

    qb.orderBy('d.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    const dtos = items.map(item => ({
      id: item.id,
      fullName: item.fullName,
      avatar: item.avatar,
      status: item.status,
      degree: item.degree,
      university: item.university,
      specialties: item.specialties,
      woundCareExperience: item.woundCareExperience,
      fieldExperience: item.fieldExperience,
      presenceDays: item.presenceDays,
      presenceHours: item.presenceHours,
    }));

    return { items: dtos, total };
  }

  async findAllPublic(): Promise<Partial<DoctorResponseDto>[]> {
    const doctors = await this.doctorRepository.find({
      where: { status: DoctorStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    return doctors.map(doctor => ({
      id: doctor.id,           
      avatar: doctor.avatar,
      fullName: doctor.fullName,
      degree: doctor.degree,
      bio: doctor.bio,
    }));
  }

  async findRandomForLanding(limit: number = 3): Promise<{ avatar: string }[]> {
    const doctors = await this.doctorRepository
      .createQueryBuilder('d')
      .where('d.status = :status', { status: DoctorStatus.ACTIVE })
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();

    return doctors.map(doctor => ({ avatar: doctor.avatar }));
  }

  async findOnePublic(id: string): Promise<Partial<DoctorResponseDto>> {
    const doctor = await this.doctorRepository.findOne({
      where: { id, status: DoctorStatus.ACTIVE },
    });
    if (!doctor) throw new NotFoundException('پزشک یافت نشد');
    return {
      id: doctor.id,
      avatar: doctor.avatar,
      fullName: doctor.fullName,
      degree: doctor.degree,
      university: doctor.university,
      woundCareExperience: doctor.woundCareExperience,
      fieldExperience: doctor.fieldExperience,
      specialties: doctor.specialties,
      presenceDays: doctor.presenceDays,
      presenceHours: doctor.presenceHours,
    };
  }

  async findOneAdmin(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('پزشک یافت نشد');
    return doctor;
  }

  async update(id: string, updateDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOneAdmin(id);
    const oldAvatar = doctor.avatar;
    const oldFile = doctor.medicalCouncilFile;

    Object.assign(doctor, updateDto);
    const updated = await this.doctorRepository.save(doctor);

    if (updateDto.avatar && updateDto.avatar !== oldAvatar) {
      await this.uploadService.deleteFile(oldAvatar).catch(e => console.error('خطا در حذف avatar:', e));
    }
    if (updateDto.medicalCouncilFile && updateDto.medicalCouncilFile !== oldFile) {
      await this.uploadService.deleteFile(oldFile).catch(e => console.error('خطا در حذف فایل نظام پزشکی:', e));
    }
    return updated;
  }

  async updateStatus(id: string, status: DoctorStatus): Promise<Doctor> {
    const doctor = await this.findOneAdmin(id);
    doctor.status = status;
    return this.doctorRepository.save(doctor);
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findOneAdmin(id);
    if (doctor.avatar) {
      await this.uploadService.deleteFile(doctor.avatar).catch(e => console.error('خطا در حذف avatar:', e));
    }
    if (doctor.medicalCouncilFile) {
      await this.uploadService.deleteFile(doctor.medicalCouncilFile).catch(e => console.error('خطا در حذف فایل نظام پزشکی:', e));
    }
    await this.doctorRepository.remove(doctor);
  }

  async getStatusCounts(): Promise<{ active: number; inactive: number; pending: number }> {
    const active = await this.doctorRepository.count({ where: { status: DoctorStatus.ACTIVE } });
    const inactive = await this.doctorRepository.count({ where: { status: DoctorStatus.INACTIVE } });
    const pending = await this.doctorRepository.count({ where: { status: DoctorStatus.PENDING } });
    return { active, inactive, pending };
  }
}