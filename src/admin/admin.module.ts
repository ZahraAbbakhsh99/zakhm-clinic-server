import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { AdminTestimonialVideosController} from './admin-testimonial-videos.controller';
import { TestimonialVideosModule } from '../testimonial-videos/testimonial-videos.module';

import { AdminCategoryController } from './admin-category.controller';
import { CategoryModule } from '../category/category.module';

import { AdminPortfolioController} from './admin-portfolio.controller';
import { PortfolioModule} from '../portfolio/portfolio.module';

import { AdminCommentController } from './admin-comment.controller';
import { CommentModule } from '../comment/comment.module';

import { AdminArticleController } from './admin-article.controller';
import { ArticleModule } from '../article/article.module';

import { AdminAppointmentController} from './admin-appointment.controller';
import { AppointmentModule} from '../appointment/appointment.module';

import { AdminDoctorController} from './admin-doctor.controller';
import { DoctorModule} from '../doctor/doctor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]),
            TestimonialVideosModule,
            CategoryModule,
            PortfolioModule,
            CommentModule,
            ArticleModule,
            AppointmentModule,
            DoctorModule,
          ],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [
    AdminController,
    AdminTestimonialVideosController,
    AdminCategoryController,
    AdminPortfolioController,
    AdminCommentController,
    AdminArticleController,
    AdminAppointmentController,
    AdminDoctorController,
  ],
})
export class AdminModule {}