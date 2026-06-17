import { Controller, Post, Body, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';

@ApiTags('Upload')
@ApiBearerAuth()
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
        type: { type: 'string', enum: ['image', 'video'] },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'image' | 'video',
  ) {
    if (!file) throw new Error('فایلی ارسال نشده است');
    const subFolder = type === 'image' ? 'images' : 'videos';
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