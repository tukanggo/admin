import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { CustomerNotificationsDTO } from './customer-notifications.entity';

@Injectable()
export class CustomerNotificationsAuthorizer implements CustomAuthorizer<CustomerNotificationsDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<CustomerNotificationsDTO>> {
    if (context?.req?.user?.type === 'Customer') {
      return { customerId: { eq: context.req.user.id } };
    } else {
      return {};
    }
  }

  async authorizeRelation(
    relationName: string,
    context: any,
  ): Promise<Filter<CustomerNotificationsDTO>> {
    return {};
  }
}
