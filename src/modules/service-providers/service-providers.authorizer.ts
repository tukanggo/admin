import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { ServiceProvidersDTO } from './service-providers.entity';

@Injectable()
export class ServiceProvidersAuthorizer implements CustomAuthorizer<ServiceProvidersDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<ServiceProvidersDTO>> {
    return {};
  }

  async authorizeRelation(
    relationName: string,
    context: any,
  ): Promise<Filter<ServiceProvidersDTO>> {
    return {};
  }
}
