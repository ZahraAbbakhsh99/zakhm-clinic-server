import { Controller, Get, Param, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  @ApiQuery({ name: 'categoryId', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
  ) {
    const { items, total } = await this.portfolioService.findAllPublic(limit, page, categoryId);
    return {
      data: items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.portfolioService.findOnePublic(id);
    return {
      item,
    };
  }
}