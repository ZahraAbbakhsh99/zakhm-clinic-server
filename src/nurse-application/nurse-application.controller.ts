import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NurseApplicationService } from './nurse-application.service';
import { CreateNurseApplicationDto } from './dto/create-nurse-application.dto';

@ApiTags('Nurse Applications')
@Controller('nurse-applications')
export class NurseApplicationController {
  constructor(private readonly applicationService: NurseApplicationService) {}

  @Post()
  async create(@Body() createDto: CreateNurseApplicationDto) {
    const application = await this.applicationService.create(createDto);
    return {
      success: true,
      message: 'درخواست شما با موفقیت ثبت شد. پس از بررسی نتیجه اعلام خواهد شد.',
      data: { id: application.id },
    };
  }
}