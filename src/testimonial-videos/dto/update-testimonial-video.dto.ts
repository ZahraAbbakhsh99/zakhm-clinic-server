import { PartialType } from '@nestjs/swagger';
import { CreateTestimonialVideoDto } from './create-testimonial-video.dto';

export class UpdateTestimonialVideoDto extends PartialType(CreateTestimonialVideoDto) {}