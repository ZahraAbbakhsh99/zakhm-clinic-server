import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { NurseApplication, NurseApplicationStatus } from './entities/nurse-application.entity';
import { CreateNurseApplicationDto } from './dto/create-nurse-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { NurseApplicationResponseDto } from './dto/nurse-application-response.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class NurseApplicationService {
  constructor(
    @InjectRepository(NurseApplication)
    private applicationRepository: Repository<NurseApplication>,
    private uploadService: UploadService,
  ) {}

  async create(createDto: CreateNurseApplicationDto): Promise<NurseApplication> {
    const existing = await this.applicationRepository.findOne({ where: { nationalCode: createDto.nationalCode } });
    if (existing) throw new ConflictException('کد ملی قبلاً ثبت شده است');
    const application = this.applicationRepository.create(createDto);
    return this.applicationRepository.save(application);
  }

  async findAllAdmin(
    page: number,
    limit: number,
    search?: string,
    degree?: string,
    status?: NurseApplicationStatus,
  ): Promise<{ items: NurseApplicationResponseDto[]; total: number }> {
    const qb = this.applicationRepository.createQueryBuilder('n');

    if (search) {
      qb.andWhere('(n.fullName LIKE :search OR n.nationalCode LIKE :search)', { search: `%${search}%` });
    }
    if (degree) {
      qb.andWhere('n.degree = :degree', { degree });
    }
    if (status) {
      qb.andWhere('n.status = :status', { status });
    }

    qb.orderBy('n.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    const dtos = items.map(item => new NurseApplicationResponseDto({
      id: item.id,
      fullName: item.fullName,
      avatar: item.avatar,
      phone: item.phone,
      nationalCode: item.nationalCode,
      degree: item.degree,
      woundCareExperience: item.woundCareExperience,
      fieldExperience: item.fieldExperience,
      province: item.province,
      city: item.city,
      address: item.address,
      medicalCouncilFile: item.medicalCouncilFile,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return { items: dtos, total };
  }

  async findOneEntity(id: string): Promise<NurseApplication> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) throw new NotFoundException('درخواست یافت نشد');
    return application;
  }

  async findOneAdmin(id: string): Promise<NurseApplicationResponseDto> {
    const application = await this.findOneEntity(id);
    return new NurseApplicationResponseDto(application);
  }

  async updateStatus(id: string, updateDto: UpdateStatusDto): Promise<NurseApplication> {
    const application = await this.findOneEntity(id);
    application.status = updateDto.status;
    return this.applicationRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOneEntity(id);
    if (application.avatar) {
      await this.uploadService.deleteFile(application.avatar).catch(e => console.error('خطا در حذف عکس:', e));
    }
    if (application.medicalCouncilFile) {
      await this.uploadService.deleteFile(application.medicalCouncilFile).catch(e => console.error('خطا در حذف فایل نظام پزشکی:', e));
    }
    await this.applicationRepository.remove(application);
  }

  async getStatusCounts(): Promise<{ pending: number; approved: number; rejected: number }> {
    const pending = await this.applicationRepository.count({ where: { status: NurseApplicationStatus.PENDING } });
    const approved = await this.applicationRepository.count({ where: { status: NurseApplicationStatus.APPROVED } });
    const rejected = await this.applicationRepository.count({ where: { status: NurseApplicationStatus.REJECTED } });
    return { pending, approved, rejected };
  }
}