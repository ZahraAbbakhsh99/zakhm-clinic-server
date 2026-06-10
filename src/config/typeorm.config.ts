import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DATABASE_URL'), 
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,   // in production make it false
  logging: true,
});