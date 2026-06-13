import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Article, ArticleStatus } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CategoryService } from '../category/category.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private categoryService: CategoryService,
    private uploadService: UploadService,
  ) {}

  async create(createDto: CreateArticleDto): Promise<Article> {
    await this.categoryService.findOne(createDto.categoryId);
    const article = this.articleRepository.create(createDto);
    return this.articleRepository.save(article);
  }

  async findAllAdmin(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
    status?: ArticleStatus,
  ): Promise<{ items: ArticleResponseDto[]; total: number }> {
    const where: FindOptionsWhere<Article> = {};
    if (search) where.title = Like(`%${search}%`);
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const [items, total] = await this.articleRepository.findAndCount({
      where,
      relations: { category: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const dtos = items.map(item => new ArticleResponseDto({
      id: item.id,
      title: item.title,
      image: item.image,
      status: item.status,
      categoryId: item.categoryId,
      categoryTitle: item.category?.title ?? '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return { items: dtos, total };
  }

  async findAllPublic(
    limit: number = 6,
    page: number = 1,
    search?: string,
    categoryId?: string,
  ): Promise<{ items: ArticleResponseDto[]; total: number }> {
    const where: FindOptionsWhere<Article> = { status: ArticleStatus.PUBLISHED };
    if (search) where.title = Like(`%${search}%`);
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await this.articleRepository.findAndCount({
      where,
      relations: { category: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const dtos = items.map(item => {
      let shortContent = item.content;
      if (shortContent.length > 100) {
        shortContent = shortContent.substring(0, 100) + '...';
      }
      return new ArticleResponseDto({
        id: item.id,
        title: item.title,
        content: shortContent,  
        image: item.image,
        status: item.status,
        categoryId: item.categoryId,
        categoryTitle: item.category?.title ?? '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    });
    return { items: dtos, total };
  }

  async findOnePublic(id: string): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id, status: ArticleStatus.PUBLISHED },
      relations: { category: true },
    });
    if (!article) throw new NotFoundException('مقاله یافت نشد');
    return new ArticleResponseDto({
      id: article.id,
      title: article.title,
      content: article.content,
      image: article.image,
      status: article.status,
      categoryId: article.categoryId,
      categoryTitle: article.category?.title ?? '',
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    });
  }

  async findOneAdmin(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!article) throw new NotFoundException('مقاله یافت نشد');
    return article;
  }

  async update(id: string, updateDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOneAdmin(id);
    const oldImage = article.image;

    if (updateDto.categoryId) await this.categoryService.findOne(updateDto.categoryId);
    Object.assign(article, updateDto);
    const updated = await this.articleRepository.save(article);

    if (updateDto.image && updateDto.image !== oldImage) {
      await this.uploadService.deleteFile(oldImage).catch(e => console.error('خطا در حذف تصویر قبلی:', e));
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const article = await this.findOneAdmin(id);
    await this.uploadService.deleteFile(article.image).catch(e => console.error('خطا در حذف تصویر:', e));
    await this.articleRepository.remove(article);
  }

  async toggleStatus(id: string): Promise<Article> {
    const article = await this.findOneAdmin(id);
    article.status = article.status === ArticleStatus.PUBLISHED 
      ? ArticleStatus.DRAFT 
      : ArticleStatus.PUBLISHED;
    return this.articleRepository.save(article);
  }
  
  async getStatusCounts(): Promise<{ published: number; draft: number }> {
    const published = await this.articleRepository.count({ where: { status: ArticleStatus.PUBLISHED } });
    const draft = await this.articleRepository.count({ where: { status: ArticleStatus.DRAFT } });
    return { published, draft };
  }
}