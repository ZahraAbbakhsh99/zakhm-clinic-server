import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { UploadModule } from '../upload/upload.module';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comment/comment.module';


@Module({
  imports: [TypeOrmModule.forFeature([Portfolio]), 
            UploadModule, 
            CategoryModule,
            CommentModule
          ],
  providers: [PortfolioService],
  controllers: [PortfolioController],
  exports: [PortfolioService],
})
export class PortfolioModule {}