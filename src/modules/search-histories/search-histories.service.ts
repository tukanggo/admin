import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { SearchHistoriesEntity } from './search-histories.entity';

@Injectable()
@QueryService(SearchHistoriesEntity)
export class SearchHistoriesService extends TypeOrmQueryService<SearchHistoriesEntity> {
  constructor(
    @InjectRepository(SearchHistoriesEntity) searchHistoriesRepo: Repository<SearchHistoriesEntity>,
  ) {
    super(searchHistoriesRepo, { useSoftDelete: true });
  }
}
