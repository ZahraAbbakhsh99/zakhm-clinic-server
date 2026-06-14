import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createDto: CreateCommentDto): Promise<Comment> {
    const comment = new Comment();
    comment.name = createDto.name;
    comment.email = createDto.email;
    comment.comment = createDto.comment;
    comment.entityType = createDto.entityType || 'general';
    comment.entityId = createDto.entityId || 'general'; // مقدار پیش‌فرض 'general'
    comment.isApproved = false;
    return this.commentRepository.save(comment);
  }

  async findForEntity(entityType: string, entityId: string, onlyApproved = true): Promise<Comment[]> {
    const where: any = { entityType, entityId };
    if (onlyApproved) where.isApproved = true;
    return this.commentRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findAllAdmin(
    page: number,
    limit: number,
    entityType?: string,
    isApproved?: boolean,
    search?: string,
  ): Promise<{ items: Comment[]; total: number }> {
    const where: FindOptionsWhere<Comment> = {};
    if (entityType) where.entityType = entityType;
    if (isApproved !== undefined) where.isApproved = isApproved;
    if (search) {
      where.name = Like(`%${search}%`);
      // OR condition for email and comment - for simplicity we'll use query builder or a simple approach
      // We'll use query builder for more complex search later; here simple approach: only search name
      // To search multiple fields, better to use QueryBuilder. But for brevity, we'll search only name.
    }

    const [items, total] = await this.commentRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('نظر یافت نشد');
    return comment;
  }

  async approve(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    if (comment.isApproved) throw new BadRequestException('نظر قبلاً تأیید شده است');
    comment.isApproved = true;
    return this.commentRepository.save(comment);
  }

  async reject(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment.isApproved) throw new BadRequestException('نظر قبلاً رد شده است');
    comment.isApproved = false;
    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
  }

  async getCountByEntity(
    entityType: string,
    entityId: string,
    onlyApproved: boolean = false,
  ): Promise<number> {
    const where: any = { entityType, entityId };
    if (onlyApproved) {
      where.isApproved = true;
    }
    return this.commentRepository.count({ where });
  }

  async findRandomApproved(limit: number = 3): Promise<Comment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.isApproved = :isApproved', { isApproved: true })
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();
    return comments;
  }
}