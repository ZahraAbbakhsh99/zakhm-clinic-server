import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '../doctor/dto/create-doctor.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async create(@Body() createDto: CreateDoctorDto) {
    const doctor = await this.doctorService.create(createDto);
    return { doctor };
  }

  @Get()
  async findAll() {
    const doctors = await this.doctorService.findAllPublic();
    return { doctors };
  }

  @Get('landing')
  async findRandomForLanding() {
    const doctors = await this.doctorService.findRandomForLanding(3);
    return { doctors };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doctor = await this.doctorService.findOnePublic(id);
    return { doctor };
  }
}