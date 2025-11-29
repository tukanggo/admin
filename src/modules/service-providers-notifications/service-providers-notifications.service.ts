import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { ServiceProvidersNotificationsEntity } from './service-providers-notifications.entity';

@Injectable()
@QueryService(ServiceProvidersNotificationsEntity)
export class ServiceProvidersNotificationsService extends TypeOrmQueryService<ServiceProvidersNotificationsEntity> {
  constructor(
    @InjectRepository(ServiceProvidersNotificationsEntity) serviceProvidersNotificationsRepo: Repository<ServiceProvidersNotificationsEntity>,
  ) {
    super(serviceProvidersNotificationsRepo, { useSoftDelete: true });
  }
}
