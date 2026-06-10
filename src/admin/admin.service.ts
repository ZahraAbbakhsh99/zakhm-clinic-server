import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Omit<Admin, 'password'>> {
    const existing = await this.adminRepository.findOne({ where: { username: createAdminDto.username } });
    if (existing) throw new ConflictException('نام کاربری قبلاً ثبت شده است');

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });
    await this.adminRepository.save(admin);
    
    const { password, ...result } = admin;
    return result;
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string): Promise<Omit<Admin, 'password'> | null> {
    const admin = await this.findByUsername(username);
    if (!admin) return null;
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return null;
    
    await this.adminRepository.update(admin.id, { lastLogin: new Date() });
    
    const { password: _, ...result } = admin;
    return result;
  }

  async getAdminProfile(id: string): Promise<Omit<Admin, 'password'> | null> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) return null;
    
    const { password, ...result } = admin;
    return result;
  }
}