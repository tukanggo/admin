import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { AreaOfServiceEntity } from './area-of-service.entity';

@Injectable()
@QueryService(AreaOfServiceEntity)
export class AreaOfServiceService extends TypeOrmQueryService<AreaOfServiceEntity> {
  constructor(
    @InjectRepository(AreaOfServiceEntity) areaOfServiceRepo: Repository<AreaOfServiceEntity>,
  ) {
    super(areaOfServiceRepo, { useSoftDelete: true });
  }
}
