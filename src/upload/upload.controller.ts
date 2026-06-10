import { Controller, Post, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
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
      data: {
        uploadUrl: url,          
        fileKey: key,     
        publicUrl: finalPublicUrl, 
      },
    };
  }

  @Delete('file')
  @ApiBody({ schema: { properties: { url: { type: 'string' } } } })
  async deleteFile(@Body('url') url: string) {
    await this.uploadService.deleteFile(url);
    return { success: true, message: 'فایل با موفقیت حذف شد' };
  }
}