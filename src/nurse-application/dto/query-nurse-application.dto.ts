import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { NurseApplicationStatus } from '../entities/nurse-application.entity';

export class QueryNurseApplicationDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'مریم' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'کارشناسی پرستاری' })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({ enum: NurseApplicationStatus })
  @IsOptional()
  @IsEnum(NurseApplicationStatus)
  status?: NurseApplicationStatus;
}