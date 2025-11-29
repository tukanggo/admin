import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { ServiceProvidersEntity } from './service-providers.entity';

@Injectable()
@QueryService(ServiceProvidersEntity)
export class ServiceProvidersService extends TypeOrmQueryService<ServiceProvidersEntity> {
  constructor(
    @InjectRepository(ServiceProvidersEntity)
    serviceProvidersRepo: Repository<ServiceProvidersEntity>,
  ) {
    super(serviceProvidersRepo, { useSoftDelete: true });
  }
}
