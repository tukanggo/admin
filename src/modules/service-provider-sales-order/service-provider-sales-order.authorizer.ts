import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { ServiceProviderSalesOrderDTO } from './service-provider-sales-order.entity';

@Injectable()
export class ServiceProviderSalesOrderAuthorizer implements CustomAuthorizer<ServiceProviderSalesOrderDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<ServiceProviderSalesOrderDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<ServiceProviderSalesOrderDTO>> {
    return {};
  }
}
