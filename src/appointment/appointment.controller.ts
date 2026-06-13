import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createDto: CreateAppointmentDto) {
    const appointment = await this.appointmentService.create(createDto);
    return {
      success: true,
      message: 'نوبت شما با موفقیت ثبت شد. پس از تأیید با شما تماس گرفته می‌شود.',
      appointmentId: appointment.id,
    };
  }
}