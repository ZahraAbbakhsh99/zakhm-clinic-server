import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { ArticleService } from '../article/article.service';
import { CreateArticleDto } from '../article/dto/create-article.dto';
import { UpdateArticleDto} from '../article/dto/update-article.dto';
import { QueryArticleDto} from '../article/dto/query-article.dto';
import { ArticleStatus } from '../article/entities/article.entity';

@ApiTags('Admin - Articles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/articles')
export class AdminArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query: QueryArticleDto) {
    const { page = 1, limit = 10, search, categoryId, status } = query;
    const result = await this.articleService.findAllAdmin(page, limit, search, categoryId, status);
    return { ...result };
  }

  @Get('status-counts')
  async getStatusCounts() {
    const counts = await this.articleService.getStatusCounts();
    return { ...counts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const article = await this.articleService.findOneAdmin(id);
    const { category, ...rest } = article;
    const data = {
      ...rest,
      categoryTitle: category?.title ?? '',
    };
    return { success: true, data };
  }

  @Post()
  async create(@Body() createDto: CreateArticleDto) {
    const article = await this.articleService.create(createDto);
    return { data: article };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateArticleDto) {
    await this.articleService.update(id, updateDto);
    return { message: 'مقاله با موفقیت اپدیت شد' };
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string) {
    const article = await this.articleService.toggleStatus(id);
    return {
      message: 'وضعیت مقاله با موفقیت تغییر کرد',
      currentStatus: article.status,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.articleService.remove(id);
    return { message: 'مقاله حذف شد' };
  }
}