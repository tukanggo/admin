import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { SalesOrderServiceProofEntity } from './sales-order-service-proof.entity';

@Injectable()
@QueryService(SalesOrderServiceProofEntity)
export class SalesOrderServiceProofService extends TypeOrmQueryService<SalesOrderServiceProofEntity> {
  constructor(
    @InjectRepository(SalesOrderServiceProofEntity) salesOrderServiceProofRepo: Repository<SalesOrderServiceProofEntity>,
  ) {
    super(salesOrderServiceProofRepo, { useSoftDelete: true });
  }
}
