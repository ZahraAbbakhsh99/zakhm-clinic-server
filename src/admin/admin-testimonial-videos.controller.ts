import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { TestimonialVideosService } from '../testimonial-videos/testimonial-videos.service';
import { CreateTestimonialVideoDto } from '../testimonial-videos/dto/create-testimonial-video.dto';
import { UpdateTestimonialVideoDto} from '../testimonial-videos/dto/update-testimonial-video.dto';

@ApiTags('Admin - Testimonial Videos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/testimonial-videos')
export class AdminTestimonialVideosController {
  constructor(private readonly videosService: TestimonialVideosService) {}

  @Get('count/active')
  async getActiveCount() {
    const count = await this.videosService.countActive();
    return { count };
  }

  @Get()
  async findAll() {
    const videos = await this.videosService.findAll(false);
    return videos;
  }

  @Post()
  async create(@Body() createDto: CreateTestimonialVideoDto) {
    const video = await this.videosService.create(createDto);
    return { video };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateTestimonialVideoDto) {
    const video = await this.videosService.update(id, updateDto);
    return { message: 'با موفقیت ثبت شد' };
  }

  @Patch(':id/toggle-active')
    async toggleActive(@Param('id') id: string) {
    const video = await this.videosService.toggle(id);
    return { currentStatus: video.isActive, message: 'تغییر یافت' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.videosService.remove(id);
    return { message: 'حذف شد' };
  }
}