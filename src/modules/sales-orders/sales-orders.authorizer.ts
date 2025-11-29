import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { SalesOrdersDTO } from './sales-orders.entity';

@Injectable()
export class SalesOrdersAuthorizer implements CustomAuthorizer<SalesOrdersDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<SalesOrdersDTO>> {
    if (context?.req?.user?.type === 'Customer') {
      return { customerId: { eq: context.req.user.id } };
    } else {
      return {};
    }
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<SalesOrdersDTO>> {
    return {};
  }
}
