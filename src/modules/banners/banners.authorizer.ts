import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { BannersDTO } from './banners.entity';

@Injectable()
export class BannersAuthorizer implements CustomAuthorizer<BannersDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<BannersDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<BannersDTO>> {
    return {};
  }
}
