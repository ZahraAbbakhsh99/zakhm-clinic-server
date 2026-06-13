import { Controller, Get, Param, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { QueryArticleDto } from './dto/query-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const { items, total } = await this.articleService.findAllPublic(limit, page, search, categoryId);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const article = await this.articleService.findOnePublic(id);
    return { success: true, data: article };
  }
}