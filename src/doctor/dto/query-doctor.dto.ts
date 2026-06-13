import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DoctorStatus } from '../entities/doctor.entity';

export class QueryDoctorDto {
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

  @ApiPropertyOptional({ example: 'علی' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: DoctorStatus })
  @IsOptional()
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;
}