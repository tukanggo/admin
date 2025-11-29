import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { ServiceProvidersNotificationsDTO } from './service-providers-notifications.entity';

@Injectable()
export class ServiceProvidersNotificationsAuthorizer
  implements CustomAuthorizer<ServiceProvidersNotificationsDTO>
{
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<ServiceProvidersNotificationsDTO>> {
    if (context?.req?.user?.type === 'SERVICE_PROVIDER') {
      return { serviceProviderId: { eq: context.req.user.id } };
    } else {
      return {};
    }
  }

  async authorizeRelation(
    relationName: string,
    context: any,
  ): Promise<Filter<ServiceProvidersNotificationsDTO>> {
    return {};
  }
}
