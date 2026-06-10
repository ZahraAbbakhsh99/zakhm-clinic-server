import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../admin//entities/admin.entity';

@ApiTags('Site Settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'public' })
  async getSettings() {
    return this.siteSettingsService.getSettings();
  }

  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN)
  async updateSettings(@Body() updateDto: UpdateSiteSettingsDto) {
    const updated = await this.siteSettingsService.updateSettings(updateDto);
    return { success: true, data: updated };
  }
}