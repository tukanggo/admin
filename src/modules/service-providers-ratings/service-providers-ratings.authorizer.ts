import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { ServiceProvidersRatingsDTO } from './service-providers-ratings.entity';

@Injectable()
export class ServiceProvidersRatingsAuthorizer implements CustomAuthorizer<ServiceProvidersRatingsDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<ServiceProvidersRatingsDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<ServiceProvidersRatingsDTO>> {
    return {};
  }
}
