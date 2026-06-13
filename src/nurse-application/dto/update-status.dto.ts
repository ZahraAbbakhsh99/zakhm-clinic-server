import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NurseApplicationStatus } from '../entities/nurse-application.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: NurseApplicationStatus })
  @IsEnum(NurseApplicationStatus)
  status!: NurseApplicationStatus;
}