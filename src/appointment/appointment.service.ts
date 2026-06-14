import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { CategoryService } from '../category/category.service';
import { JalaliDateUtil} from '../common/utils/jalali';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private categoryService: CategoryService,
  ) {}

  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    await this.categoryService.findOne(createDto.categoryId);
    const appointment = this.appointmentRepository.create({
      fullName: createDto.fullName,
      phone: createDto.phone,
      categoryId: createDto.categoryId,
      description: createDto.description,
    });
    return this.appointmentRepository.save(appointment);
  }

  async findAllAdmin(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
    status?: AppointmentStatus,
    fromDate?: string, 
    toDate?: string,     
  ): Promise<{ items: AppointmentResponseDto[]; total: number }> {
    const qb = this.appointmentRepository.createQueryBuilder('a')
      .leftJoinAndSelect('a.category', 'category');

    if (search) {
      qb.andWhere('(a.fullName LIKE :search OR a.phone LIKE :search)', { search: `%${search}%` });
    }
    if (categoryId) {
      qb.andWhere('a.categoryId = :categoryId', { categoryId });
    }
    if (status) {
      qb.andWhere('a.status = :status', { status });
    }
    if (fromDate) {
      const gregorianFrom = JalaliDateUtil.convertJalaliToGregorian(fromDate);
      if (gregorianFrom) {
        qb.andWhere('a.createdAt >= :fromDate', { fromDate: gregorianFrom });
      }
    }
    if (toDate) {
      const gregorianTo = JalaliDateUtil.convertJalaliToGregorian(toDate);
      if (gregorianTo) {
        const endOfDay = new Date(gregorianTo);
        endOfDay.setHours(23, 59, 59, 999);
        qb.andWhere('a.createdAt <= :toDate', { toDate: endOfDay });
      }
    }

    qb.orderBy('a.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    const dtos = items.map(item => {
      const { category, ...rest } = item;
      return new AppointmentResponseDto({
        ...rest,
        categoryTitle: category?.title ?? '',
      });
    });
    return { items: dtos, total };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!appointment) throw new NotFoundException('نوبت یافت نشد');
    return appointment;
  }

  async updateStatus(id: string, updateDto: UpdateStatusDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = updateDto.status;
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  async getStatusCounts(): Promise<{ pending: number; approved: number; rejected: number }> {
    const pending = await this.appointmentRepository.count({ where: { status: AppointmentStatus.PENDING } });
    const approved = await this.appointmentRepository.count({ where: { status: AppointmentStatus.APPROVED } });
    const rejected = await this.appointmentRepository.count({ where: { status: AppointmentStatus.REJECTED } });
    return { pending, approved, rejected };
  }
}