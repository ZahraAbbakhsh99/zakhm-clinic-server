import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

import { Portfolio } from './entities/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';

import { UploadService } from '../upload/upload.service';

import { CategoryService } from '../category/category.service';

import { CommentService } from '../comment/comment.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private commentService: CommentService,
  ) {}

  async create(createDto: CreatePortfolioDto): Promise<Portfolio> {
    await this.categoryService.findOne(createDto.categoryId);
    const portfolio = this.portfolioRepository.create(createDto);
    return this.portfolioRepository.save(portfolio);
  }

  async findAllAdmin(
    page: number, 
    limit: number, 
    search?: string, 
    categoryId?: string
  ):Promise<{ items: PortfolioResponseDto[]; total: number }> {
    const where: FindOptionsWhere<Portfolio> = {};
    if (search) where.title = Like(`%${search}%`);
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await this.portfolioRepository.findAndCount({
      where,
      relations: { category: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const dtos = await Promise.all(
      items.map(async (item) => {
        const commentCount = await this.commentService.getCountByEntity('portfolio', item.id, false);
        return new PortfolioResponseDto({
          id: item.id,
          title: item.title,
          shortDescription: item.shortDescription,
          treatmentProcess: item.treatmentProcess,
          beforeImage: item.beforeImage,
          afterImage: item.afterImage,
          categoryId: item.categoryId,
          categoryTitle: item.category?.title ?? '',
          commentCount,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      })
    );
    return { items: dtos, total };
    }

  async findAllPublic(
    limit: number = 2, 
    page: number = 1, 
    categoryId?: string
  ): Promise<{ items: PortfolioResponseDto[]; total: number }> {
    const where: FindOptionsWhere<Portfolio> = {};
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await this.portfolioRepository.findAndCount({
      where,
      relations: { category: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const dtos = await Promise.all(
      items.map(async (item) => {
        const commentCount = await this.commentService.getCountByEntity('portfolio', item.id, true);
        return new PortfolioResponseDto({
          id: item.id,
          title: item.title,
          shortDescription: item.shortDescription,
          treatmentProcess: item.treatmentProcess,
          beforeImage: item.beforeImage,
          afterImage: item.afterImage,
          categoryId: item.categoryId,
          categoryTitle: item.category?.title ?? '',
          commentCount,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }),
    );
    return { items: dtos, total };
  }

  async findOnePublic(id: string): Promise<PortfolioResponseDto> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!portfolio) throw new NotFoundException('نمونه کار یافت نشد');
    const commentCount = await this.commentService.getCountByEntity('portfolio', portfolio.id, true);
    return new PortfolioResponseDto({
      id: portfolio.id,
      title: portfolio.title,
      shortDescription: portfolio.shortDescription,
      treatmentProcess: portfolio.treatmentProcess,
      beforeImage: portfolio.beforeImage,
      afterImage: portfolio.afterImage,
      categoryId: portfolio.categoryId,
      categoryTitle: portfolio.category?.title ?? '',
      commentCount,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    });
  }

  async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!portfolio) throw new NotFoundException('نمونه کار یافت نشد');
    return portfolio;
  }

  async update(id: string, updateDto: UpdatePortfolioDto): Promise<Portfolio> {
    const portfolio = await this.findOne(id);
    const oldBefore = portfolio.beforeImage;
    const oldAfter = portfolio.afterImage;

    if (updateDto.categoryId) await this.categoryService.findOne(updateDto.categoryId);
    Object.assign(portfolio, updateDto);
    const updated = await this.portfolioRepository.save(portfolio);

    if (updateDto.beforeImage && updateDto.beforeImage !== oldBefore) {
      await this.uploadService.deleteFile(oldBefore).catch(e => console.error('خطا در حذف beforeImage:', e));
    }
    if (updateDto.afterImage && updateDto.afterImage !== oldAfter) {
      await this.uploadService.deleteFile(oldAfter).catch(e => console.error('خطا در حذف afterImage:', e));
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const portfolio = await this.findOne(id);
    await Promise.all([
      this.uploadService.deleteFile(portfolio.beforeImage).catch(e => console.error('خطا در حذف beforeImage:', e)),
      this.uploadService.deleteFile(portfolio.afterImage).catch(e => console.error('خطا در حذف afterImage:', e)),
    ]);
    await this.portfolioRepository.remove(portfolio);
  }
}