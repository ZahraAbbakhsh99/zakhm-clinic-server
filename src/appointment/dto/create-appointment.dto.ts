import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'علی رضایی' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '09123456789' })
  @IsPhoneNumber('IR')
  phone!: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ example: 'توضیحات بیمار...' })
  @IsString()
  @IsNotEmpty()
  description!: string;
}