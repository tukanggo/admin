import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { CustomerAddressesDTO } from './customer-addresses.entity';

@Injectable()
export class CustomerAddressesAuthorizer implements CustomAuthorizer<CustomerAddressesDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<CustomerAddressesDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<CustomerAddressesDTO>> {
    return {};
  }
}
