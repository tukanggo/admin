import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { ServiceProvidersRatingsEntity } from './service-providers-ratings.entity';

@Injectable()
@QueryService(ServiceProvidersRatingsEntity)
export class ServiceProvidersRatingsService extends TypeOrmQueryService<ServiceProvidersRatingsEntity> {
  constructor(
    @InjectRepository(ServiceProvidersRatingsEntity) serviceProvidersRatingsRepo: Repository<ServiceProvidersRatingsEntity>,
  ) {
    super(serviceProvidersRatingsRepo, { useSoftDelete: true });
  }
}
