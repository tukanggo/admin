import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { ServiceProviderSalesOrderEntity } from './service-provider-sales-order.entity';

@Injectable()
@QueryService(ServiceProviderSalesOrderEntity)
export class ServiceProviderSalesOrderService extends TypeOrmQueryService<ServiceProviderSalesOrderEntity> {
  constructor(
    @InjectRepository(ServiceProviderSalesOrderEntity) serviceProviderSalesOrderRepo: Repository<ServiceProviderSalesOrderEntity>,
  ) {
    super(serviceProviderSalesOrderRepo, { useSoftDelete: true });
  }
}
