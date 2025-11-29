import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { BannersEntity } from './banners.entity';

@Injectable()
@QueryService(BannersEntity)
export class BannersService extends TypeOrmQueryService<BannersEntity> {
  constructor(@InjectRepository(BannersEntity) bannersRepo: Repository<BannersEntity>) {
    super(bannersRepo, { useSoftDelete: true });
  }
}
