import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { AreaOfServiceDTO } from './area-of-service.entity';

@Injectable()
export class AreaOfServiceAuthorizer implements CustomAuthorizer<AreaOfServiceDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<AreaOfServiceDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<AreaOfServiceDTO>> {
    return {};
  }
}
