import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { AppointmentService } from '../appointment/appointment.service';
import { UpdateStatusDto } from '../appointment/dto/update-status.dto';
import { QueryAppointmentDto} from '../appointment/dto/query-appointment.dto';

@ApiTags('Admin - Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/appointments')
export class AdminAppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async findAll(@Query() query: QueryAppointmentDto) {
    const { page = 1, limit = 10, search, categoryId, status, fromDate, toDate } = query;
    const result = await this.appointmentService.findAllAdmin(page, limit, search, categoryId, status, fromDate, toDate);
    return { items: result.items, total: result.total };
  }

  @Get('status-counts')
  async getStatusCounts() {
    const counts = await this.appointmentService.getStatusCounts();
    return { ...counts };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateStatusDto) {
    const appointment = await this.appointmentService.updateStatus(id, updateDto);
    return { message: 'وضعیت نوبت با موفقیت تغییر کرد', currentStatus: appointment.status};
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.appointmentService.remove(id);
    return { message: 'نوبت حذف شد' };
  }
}