import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucket: string;
  private publicEndpoint: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('LIARA_ENDPOINT');
    const accessKey = this.configService.get<string>('LIARA_ACCESS_KEY');
    const secretKey = this.configService.get<string>('LIARA_SECRET_KEY');
    const bucket = this.configService.get<string>('LIARA_BUCKET_NAME');
    const publicEndpoint = this.configService.get<string>('LIARA_PUBLIC_ENDPOINT');

    if (!bucket || !publicEndpoint || !endpoint || !accessKey || !secretKey) {
      throw new Error('Missing Liara S3 environment variables');
    }

    this.bucket = bucket;
    this.publicEndpoint = publicEndpoint;

    this.s3Client = new S3Client({
      region: 'default',
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true, 
    });
  }

  /**
   * create Presigned URL for direct upload
   * @param fileName 
   * @param subFolder 
   * @returns 
   */
  async generatePresignedUrl(fileName: string, subFolder: string = 'general'): Promise<{ url: string; key: string }> {
    const extension = path.extname(fileName);
    const uniqueFileName = `${uuidv4()}${extension}`;
    const key = `clinic-files/${subFolder}/${uniqueFileName}`; // path in bucket

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: this.getContentType(extension),
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 }); // 5 minutes credit

    return { url: signedUrl, key };
  }


  async uploadFileDirect(file: Express.Multer.File, subFolder: string = 'general'): Promise<string> {
    const extension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${extension}`;
    const key = `clinic-files/${subFolder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return this.getPublicUrl(key);
}

  /**
   * delete file by fileUrl
   * @param fileUrl 
   */
  async deleteFile(fileUrl: string): Promise<void> {
    // find key from public file url
    const key = fileUrl.replace(`${this.publicEndpoint}/`, '');
    if (!key.startsWith('clinic-files/')) {
      throw new Error('آدرس فایل معتبر نیست');
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  /**
   * return public file url by key
   */
  getPublicUrl(key: string): string {
    return `${this.publicEndpoint}/${key}`;
  }

  private getContentType(extension: string): string {
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.pdf': 'application/pdf',
    };
    return mimeMap[extension.toLowerCase()] || 'application/octet-stream';
  }
}

