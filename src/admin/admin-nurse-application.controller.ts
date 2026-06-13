import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { NurseApplicationService } from '../nurse-application/nurse-application.service';
import { UpdateStatusDto } from '../nurse-application/dto/update-status.dto';
import { QueryNurseApplicationDto} from '../nurse-application/dto/query-nurse-application.dto';

@ApiTags('Admin - Nurse Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/nurse-applications')
export class AdminNurseApplicationController {
  constructor(private readonly applicationService: NurseApplicationService) {}

  @Get()
  async findAll(@Query() query: QueryNurseApplicationDto) {
    const { page = 1, limit = 10, search, degree, status } = query;
    const result = await this.applicationService.findAllAdmin(page, limit, search, degree, status);
    return { ...result };
  }

  @Get('status-counts')
  async getStatusCounts() {
    const counts = await this.applicationService.getStatusCounts();
    return { ...counts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const application = await this.applicationService.findOneAdmin(id);
    return { application };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateStatusDto) {
    const application = await this.applicationService.updateStatus(id, updateDto);
    return { message: 'وضعیت درخواست با موفقیت تغییر کرد', currentStatus: application.status };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.applicationService.remove(id);
    return { message: 'درخواست حذف شد' };
  }
}