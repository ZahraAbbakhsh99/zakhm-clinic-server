import { Controller, Get, Post, Body, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JalaliDateUtil} from '../common/utils/jalali';

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

  @Get('random')
  @ApiQuery({ name: 'limit', required: false, example: 3, description: 'تعداد نظرات (حداکثر ۲۰)' })
  async getRandomComments(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ) {
    const safeLimit = Math.min(limit, 20);
    const comments = await this.commentService.findRandomApproved(safeLimit);
    
    const data = comments.map(comment => ({
      id: comment.id,
      name: comment.name,
      comment: comment.comment,
      jalaliDate: JalaliDateUtil.toJalali(comment.createdAt, 'jDD jMMMM jYYYY'),
    }));
    
    return { success: true, data };
  }
}