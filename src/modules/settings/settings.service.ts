import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { SettingsEntity } from './settings.entity';

@Injectable()
@QueryService(SettingsEntity)
export class SettingsService extends TypeOrmQueryService<SettingsEntity> {
  constructor(
    @InjectRepository(SettingsEntity) settingsRepo: Repository<SettingsEntity>,
  ) {
    super(settingsRepo, { useSoftDelete: true });
  }
}
