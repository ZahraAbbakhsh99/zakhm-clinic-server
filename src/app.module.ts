import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { TestimonialVideosModule } from './testimonial-videos/testimonial-videos.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}