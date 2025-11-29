import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { ServiceAreaEntity } from './service-area.entity';

@Injectable()
@QueryService(ServiceAreaEntity)
export class ServiceAreaService extends TypeOrmQueryService<ServiceAreaEntity> {
  constructor(
    @InjectRepository(ServiceAreaEntity) serviceAreaRepo: Repository<ServiceAreaEntity>,
  ) {
    super(serviceAreaRepo, { useSoftDelete: true });
  }
}
