import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { ServiceAreaDTO } from './service-area.entity';

@Injectable()
export class ServiceAreaAuthorizer implements CustomAuthorizer<ServiceAreaDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<ServiceAreaDTO>> {
    if (context?.req?.user?.type === 'SERVICE_PROVIDER') {
      return { serviceProviderId: { eq: context.req.user.id } };
    } else {
      return {};
    }
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<ServiceAreaDTO>> {
    return {};
  }
}
