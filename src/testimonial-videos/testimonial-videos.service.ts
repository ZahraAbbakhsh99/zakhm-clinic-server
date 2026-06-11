import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestimonialVideo } from './entities/testimonial-video.entity';
import { CreateTestimonialVideoDto } from './dto/create-testimonial-video.dto';
import { UpdateTestimonialVideoDto } from './dto/update-testimonial-video.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class TestimonialVideosService {
  constructor(
    @InjectRepository(TestimonialVideo)
    private videoRepository: Repository<TestimonialVideo>,
    private uploadService: UploadService,
  ) {}

  async create(createDto: CreateTestimonialVideoDto): Promise<TestimonialVideo> {
    const video = this.videoRepository.create(createDto);
    return this.videoRepository.save(video);
  }

  async findAll(onlyActive: boolean = false): Promise<TestimonialVideo[]> {
    const where: any = {};
    if (onlyActive) where.isActive = true;
    return this.videoRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TestimonialVideo> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) throw new NotFoundException('ویدیو یافت نشد');
    return video;
  }

  async update(id: string, updateDto: UpdateTestimonialVideoDto): Promise<TestimonialVideo> {
    const video = await this.findOne(id);
    const oldVideoUrl = video.videoUrl;
    Object.assign(video, updateDto);
    const updated = await this.videoRepository.save(video);
    
    if (updateDto.videoUrl && updateDto.videoUrl !== oldVideoUrl) {
      try {
        await this.uploadService.deleteFile(oldVideoUrl);
      } catch (error) {
        console.error('خطا در حذف فایل قبلی از لیارا:', error);
      }
    }
    return updated;
  }

  async toggle(id: string): Promise<TestimonialVideo> {
    const video = await this.findOne(id);
    video.isActive = !video.isActive;
    return this.videoRepository.save(video);
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    try {
      await this.uploadService.deleteFile(video.videoUrl);
    } catch (error) {
      console.error('خطا در حذف فایل از لیارا:', error);
    }
    await this.videoRepository.remove(video);
  }

  async countActive(): Promise<number> {
    return this.videoRepository.count({ where: { isActive: true } });
  }
}