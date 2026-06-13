import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { DoctorService } from '../doctor/doctor.service';
import { UpdateDoctorDto } from '../doctor/dto/update-doctor.dto';
import { QueryDoctorDto} from '../doctor/dto/query-doctor.dto';
import { DoctorStatus } from '../doctor/entities/doctor.entity';

@ApiTags('Admin - Doctors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/doctors')
export class AdminDoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(@Query() query: QueryDoctorDto) {
    const { page = 1, limit = 10, search, status } = query;
    const result = await this.doctorService.findAllAdmin(page, limit, search, status);
    return { ...result };
  }

  @Get('status-counts')
  async getStatusCounts() {
    const counts = await this.doctorService.getStatusCounts();
    return { ...counts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doctor = await this.doctorService.findOneAdmin(id);
    return { doctor };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDoctorDto) {
    await this.doctorService.update(id, updateDto);
    return { message: 'دکتر با موفقیت اپدیت شد' };
  }

  @Patch(':id/status')
  @ApiBody({ schema: { properties: { status: { type: 'string', enum: ['active', 'inactive', 'pending'] } } } })
  async updateStatus(@Param('id') id: string, @Body('status') status: DoctorStatus) {
    const doctor = await this.doctorService.updateStatus(id, status);
    return { message: 'وضعیت پزشک به‌روز شد', currentStatus: doctor.status };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.doctorService.remove(id);
    return { message: 'پزشک حذف شد' };
  }
}