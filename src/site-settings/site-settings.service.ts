import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private siteSettingRepository: Repository<SiteSetting>,
  ) {}

  async getSettings(): Promise<SiteSetting> {
    let settings = await this.siteSettingRepository.findOne({ where: {} });
    if (!settings) {
      settings = this.siteSettingRepository.create({});
      settings = await this.siteSettingRepository.save(settings);
    }
    return settings;
  }

  async updateSettings(updateDto: UpdateSiteSettingsDto): Promise<SiteSetting> {
    const settings = await this.getSettings();
    Object.assign(settings, updateDto);
    return this.siteSettingRepository.save(settings);
  }
}