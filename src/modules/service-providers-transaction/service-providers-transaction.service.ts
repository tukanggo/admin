import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { ServiceProvidersTransactionEntity } from './service-providers-transaction.entity';

@Injectable()
@QueryService(ServiceProvidersTransactionEntity)
export class ServiceProvidersTransactionService extends TypeOrmQueryService<ServiceProvidersTransactionEntity> {
  constructor(
    @InjectRepository(ServiceProvidersTransactionEntity) serviceProvidersTransactionRepo: Repository<ServiceProvidersTransactionEntity>,
  ) {
    super(serviceProvidersTransactionRepo, { useSoftDelete: true });
  }
}
