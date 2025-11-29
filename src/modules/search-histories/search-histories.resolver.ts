/* eslint-disable max-len */
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { SearchHistoriesDTO, SearchHistoriesEntity } from './search-histories.entity';
import {
  SearchHistoriesConnection,
  SearchHistoriesQuery,
  CustomCreateManySearchHistoriesInput,
  CustomCreateOneSearchHistoriesInput,
  CustomDeleteOneSearchHistoriesInput,
  CustomFindOneSearchHistoriesArgs,
  CustomUpdateOneSearchHistoriesInput,
} from './search-histories.input';
import { SearchHistoriesService } from './search-histories.service';
import { GqlAuthUser } from '@modules/auth';
import { AuthData } from '@types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlAuthGuard } from '@guards/auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => SearchHistoriesDTO)
export class SearchHistoriesResolver {
  constructor(
    private readonly searchHistoriesService: SearchHistoriesService,
    @InjectRepository(SearchHistoriesEntity)
    private searchHistoriesRepo: Repository<SearchHistoriesEntity>,
  ) {}
  @Query(() => [SearchHistoriesDTO])
  async MySearchHistories(@GqlAuthUser() user: AuthData) {
    const history = await this.searchHistoriesRepo
      .createQueryBuilder()
      .select('*')
      .where('customerId=:customerId', { customerId: user.id })
      .take(10)
      .groupBy('keyword')
      .getRawMany();
    return history;
  }

  @Query(() => [SearchHistoriesDTO])
  async getPopularSearchHistories() {
    const history = await this.searchHistoriesRepo.query(`
      SELECT sh.id as id, sh.customerId as customerId,
      sh.keyword as keyword, sh.createdAt as createdAt, 
      sh.updatedAt as updatedAt, sh.deletedAt as deletedAt, 
      sh.createdBy as createdBy, sh.updatedBy as updatedBy, sh.deletedBy as deletedBy,
      COUNT(sh.keyword) as searchCount
      FROM search_histories sh
      WHERE sh.deletedAt IS NULL
      GROUP BY sh.keyword
      ORDER BY searchCount DESC
      limit 10
    `);
    return history;
  }
}
