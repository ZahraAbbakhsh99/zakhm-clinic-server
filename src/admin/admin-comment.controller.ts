import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard} from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entities/admin.entity';
import { CommentService } from '../comment/comment.service';
import { QueryCommentDto } from '../comment/dto/query-comment.dto';

@ApiTags('Admin - Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@Controller('admin/comments')
export class AdminCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(@Query() query: QueryCommentDto) {
    const { page = 1, limit = 10, entityType, isApproved, search } = query;
    const result = await this.commentService.findAllAdmin(page, limit, entityType, isApproved, search);
    return { ...result };
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    await this.commentService.approve(id);
    return { massage: 'نظر تایید شد'  };
  }

  @Delete(':id')
  async reject(@Param('id') id: string) {
    await this.commentService.reject(id);
    return { message: 'نظر رد شد' };
  }
}