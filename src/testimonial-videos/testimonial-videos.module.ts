import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialVideo } from './entities/testimonial-video.entity';
import { TestimonialVideosService } from './testimonial-videos.service';
import { TestimonialVideosController } from './testimonial-videos.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestimonialVideo]), UploadModule],
  providers: [TestimonialVideosService],
  controllers: [TestimonialVideosController],
  exports: [TestimonialVideosService],
})
export class TestimonialVideosModule {}