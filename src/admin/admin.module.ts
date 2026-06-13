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

@Module({
  imports: [TypeOrmModule.forFeature([Admin]),
            TestimonialVideosModule,
            CategoryModule,
            PortfolioModule,
            CommentModule,
          ],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [
    AdminController,
    AdminTestimonialVideosController,
    AdminCategoryController,
    AdminPortfolioController,
    AdminCommentController,
  ],
})
export class AdminModule {}