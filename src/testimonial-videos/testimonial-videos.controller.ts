import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestimonialVideosService } from './testimonial-videos.service';

@ApiTags('Testimonial Videos')
@Controller('testimonial-videos')
export class TestimonialVideosController {
  constructor(private readonly videosService: TestimonialVideosService) {}

  @Get()
  async findAllPublic() {
    return this.videosService.findAll(true);
  }

  @Get(':id')
  async findOnePublic(@Param('id') id: string) {
    const video = await this.videosService.findOne(id);
    if (!video.isActive) throw new NotFoundException();
    return video;
  }
}
