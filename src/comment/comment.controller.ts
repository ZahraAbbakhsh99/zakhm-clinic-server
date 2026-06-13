import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createDto: CreateCommentDto) {
    const comment = await this.commentService.create(createDto);
    return {
      success: true,
      message: 'نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد',
      data: { id: comment.id },
    };
  }

  @Get()
  @ApiQuery({ name: 'entityType', required: true, example: 'portfolio' })
  @ApiQuery({ name: 'entityId', required: true, example: 'uuid' })
  async getCommentsForEntity(@Query('entityType') entityType: string, @Query('entityId') entityId: string) {
    const comments = await this.commentService.findForEntity(entityType, entityId, true);
    return { success: true, data: comments };
  }
}