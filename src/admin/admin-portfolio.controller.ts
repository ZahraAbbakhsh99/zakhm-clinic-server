import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CreatePortfolioDto } from '../portfolio/dto/create-portfolio.dto';
import { UpdatePortfolioDto} from '../portfolio/dto/update-portfolio.dto';
import { QueryPortfolioDto} from '../portfolio/dto/query-portfolio.dto';

@ApiTags('Admin - Portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/portfolio')
export class AdminPortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async findAll(@Query() query: QueryPortfolioDto) {
    const { page = 1, limit = 10, search, categoryId } = query;
    const { items, total } = await this.portfolioService.findAllAdmin(page, limit, search, categoryId);
    return { items, total };
  }

  @Post()
  async create(@Body() createDto: CreatePortfolioDto) {
    const portfolio = await this.portfolioService.create(createDto);
    return { data: portfolio };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdatePortfolioDto) {
    await this.portfolioService.update(id, updateDto);
    return { message: 'با موفقیت اپدیت شد' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.portfolioService.remove(id);
    return { message: 'نمونه کار حذف شد' };
  }
}