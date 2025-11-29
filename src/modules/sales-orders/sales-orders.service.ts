import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Query, QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { SalesOrdersEntity } from './sales-orders.entity';
import { FilterQueryBuilder } from '@nestjs-query/query-typeorm/dist/src/query';

@Injectable()
@QueryService(SalesOrdersEntity)
export class SalesOrdersService extends TypeOrmQueryService<SalesOrdersEntity> {
  constructor(@InjectRepository(SalesOrdersEntity) salesOrdersRepo: Repository<SalesOrdersEntity>) {
    super(salesOrdersRepo, { useSoftDelete: true });
  }

  query(query: Query<SalesOrdersEntity>): Promise<SalesOrdersEntity[]> {
    return new FilterQueryBuilder<SalesOrdersEntity>(this.repo)
      .select(query)
      .withDeleted()
      .getMany();
  }
}
