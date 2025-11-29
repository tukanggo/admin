import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { ServiceProvidersTransactionDTO } from './service-providers-transaction.entity';

@Injectable()
export class ServiceProvidersTransactionAuthorizer
  implements CustomAuthorizer<ServiceProvidersTransactionDTO>
{
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<ServiceProvidersTransactionDTO>> {
    return {};
  }

  async authorizeRelation(
    relationName: string,
    context: any,
  ): Promise<Filter<ServiceProvidersTransactionDTO>> {
    return {};
  }
}
