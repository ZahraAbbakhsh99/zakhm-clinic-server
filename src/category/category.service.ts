import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: [{ title: createDto.title }, { slug: createDto.slug }],
    });
    if (existing) throw new ConflictException('عنوان یا اسلاگ تکراری است');
    const category = this.categoryRepository.create(createDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { title: 'ASC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('دسته‌بندی یافت نشد');
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (updateDto.title && updateDto.title !== category.title) {
      const existingTitle = await this.categoryRepository.findOne({ where: { title: updateDto.title } });
      if (existingTitle && existingTitle.id !== id) throw new ConflictException('عنوان تکراری است');
    }
    if (updateDto.slug && updateDto.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({ where: { slug: updateDto.slug } });
      if (existingSlug && existingSlug.id !== id) throw new ConflictException('اسلاگ تکراری است');
    }
    Object.assign(category, updateDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    // if (category.portfolios && category.portfolios.length > 0) {
    //   throw new ConflictException('این دسته‌بندی دارای نمونه کار است، ابتدا آن‌ها را حذف کنید');
    // }
    await this.categoryRepository.remove(category);
  }
}