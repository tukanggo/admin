import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { SearchHistoriesDTO } from './search-histories.entity';

@Injectable()
export class SearchHistoriesAuthorizer implements CustomAuthorizer<SearchHistoriesDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<SearchHistoriesDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<SearchHistoriesDTO>> {
    return {};
  }
}
