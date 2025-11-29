import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { CustomerNotificationsEntity } from './customer-notifications.entity';

@Injectable()
@QueryService(CustomerNotificationsEntity)
export class CustomerNotificationsService extends TypeOrmQueryService<CustomerNotificationsEntity> {
  constructor(
    @InjectRepository(CustomerNotificationsEntity)
    customerNotificationsRepo: Repository<CustomerNotificationsEntity>,
  ) {
    super(customerNotificationsRepo, { useSoftDelete: true });
  }
}
