import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { DashboardService } from '../dashboard/dashboard.service';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('new-applications')
  async getNewApplicationsCount() {
    const count = await this.dashboardService.getNewNurseApplicationsCount();
    return { count };
  }

  @Get('articles-stats')
  async getArticlesStats() {
    const stats = await this.dashboardService.getArticlesStats();
    return { ...stats };
  }

  @Get('weekly-appointments')
  async getWeeklyAppointments() {
    const data = await this.dashboardService.getWeeklyAppointments();
    return { data };
  }

  @Get('latest-comments')
  async getLatestComments() {
    const comments = await this.dashboardService.getLatestComments(3);
    return { data: comments };
  }
}