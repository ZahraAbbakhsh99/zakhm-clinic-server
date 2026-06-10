import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private configService: ConfigService,
  ) {}

  @Post('create')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const allowCreation = this.configService.get<string>('ALLOW_ADMIN_CREATION') === 'true';
    if (!allowCreation) {
      throw new ForbiddenException('این روت در حال حاضر غیرفعال است');
    }
    const admin = await this.adminService.create(createAdminDto);
    return { success: true, data: admin };
  }
}