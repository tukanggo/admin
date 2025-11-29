import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { SettingsDTO } from './settings.entity';

@Injectable()
export class SettingsAuthorizer implements CustomAuthorizer<SettingsDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<SettingsDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<SettingsDTO>> {
    return {};
  }
}
