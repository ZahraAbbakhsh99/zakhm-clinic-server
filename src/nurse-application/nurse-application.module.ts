import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NurseApplication } from './entities/nurse-application.entity';
import { NurseApplicationService } from './nurse-application.service';
import { NurseApplicationController } from './nurse-application.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([NurseApplication]), UploadModule],
  providers: [NurseApplicationService],
  controllers: [NurseApplicationController],
  exports: [NurseApplicationService],
})
export class NurseApplicationModule {}