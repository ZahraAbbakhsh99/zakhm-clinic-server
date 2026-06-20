import { Controller, Post, Body, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';

const MAX_FILE_SIZE = {
  image: 20 * 1024 * 1024,   // 20 MB
  video: 100 * 1024 * 1024,   // 100 MB
  file: 50 * 1024 * 1024,    // 50 MB
  general: 10 * 1024 * 1024, // 10 MB
};

const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  file: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-rar-compressed',
  ],
  general: ['*/*'],
};

@ApiTags('Upload')
// @ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('request-upload')
  async requestUploadUrl(@Body() dto: GetPresignedUrlDto) {
    const subFolder = dto.type === 'image' ? 'images' : 'videos';
    const { url, key } = await this.uploadService.generatePresignedUrl(dto.fileName, subFolder);
    const finalPublicUrl = this.uploadService.getPublicUrl(key);
    return {
      success: true,
      data: { uploadUrl: url, fileKey: key, publicUrl: finalPublicUrl },
    };
  }

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        type: {
          type: 'string',
          enum: ['image', 'video', 'file', 'general'],
          default: 'general',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: MAX_FILE_SIZE.general,
    },
    fileFilter: (req, file, callback) => {
      const allowed = Object.values(ALLOWED_MIME_TYPES).flat();
      if (allowed.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('فرمت فایل مجاز نیست'), false);
      }
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'image' | 'video' | 'file' | 'general' = 'general',
  ) {
    if (!file) throw new BadRequestException('فایلی ارسال نشده است');

    let subFolder: string;
    let maxSize: number;
    let allowedMimes: string[];

    if (type === 'image') {
      subFolder = 'images';
      maxSize = MAX_FILE_SIZE.image;
      allowedMimes = ALLOWED_MIME_TYPES.image;
    } else if (type === 'video') {
      subFolder = 'videos';
      maxSize = MAX_FILE_SIZE.video;
      allowedMimes = ALLOWED_MIME_TYPES.video;
    } else if (type === 'file') {
      subFolder = 'files';
      maxSize = MAX_FILE_SIZE.file;
      allowedMimes = ALLOWED_MIME_TYPES.file;
    } else {
      subFolder = 'general';
      maxSize = MAX_FILE_SIZE.general;
      allowedMimes = ALLOWED_MIME_TYPES.general; 
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        `حجم فایل نباید بیشتر از ${maxSize / (1024 * 1024)} مگابایت باشد`,
      );
    }
    if (type !== 'general' && !allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(`فرمت فایل مجاز نیست. فرمت‌های مجاز: ${allowedMimes.join(', ')}`);
    }

    const publicUrl = await this.uploadService.uploadFileDirect(file, subFolder);
    return { success: true, data: { publicUrl } };
  }

  @Delete('file')
  @ApiBody({ schema: { properties: { url: { type: 'string' } } } })
  async deleteFile(@Body('url') url: string) {
    await this.uploadService.deleteFile(url);
    return { success: true, message: 'فایل با موفقیت حذف شد' };
  }
}