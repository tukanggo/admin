import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { SalesOrderServiceProofDTO } from './sales-order-service-proof.entity';

@Injectable()
export class SalesOrderServiceProofAuthorizer implements CustomAuthorizer<SalesOrderServiceProofDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<SalesOrderServiceProofDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<SalesOrderServiceProofDTO>> {
    return {};
  }
}
