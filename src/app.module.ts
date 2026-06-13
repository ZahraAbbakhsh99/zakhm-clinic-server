import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { TestimonialVideosModule } from './testimonial-videos/testimonial-videos.module';
import { CategoryModule } from './category/category.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CommentModule } from './comment/comment.module';
import { ArticleModule } from './article/article.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    UploadModule,
    AdminModule,
    AuthModule,
    SiteSettingsModule,
    TestimonialVideosModule,
    CategoryModule,
    PortfolioModule,
    CommentModule,
    ArticleModule,
    AppointmentModule,
    DoctorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}