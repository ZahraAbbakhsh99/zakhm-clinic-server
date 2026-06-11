import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminTestimonialVideosController} from './admin-testimonial-videos.controller';
import { TestimonialVideosModule } from '../testimonial-videos/testimonial-videos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]),
            TestimonialVideosModule
          ],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [
    AdminController,
    AdminTestimonialVideosController,
  ],
})
export class AdminModule {}