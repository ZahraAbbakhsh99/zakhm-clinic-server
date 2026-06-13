import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { NurseApplication } from '../nurse-application/entities/nurse-application.entity';
import { Article } from '../article/entities/article.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NurseApplication, Article, Appointment, Comment]),
  ],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}