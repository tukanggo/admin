import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { AdminsRolesPermissionsDTO } from './admins-roles-permissions.entity';

@Injectable()
export class AdminsRolesPermissionsAuthorizer implements CustomAuthorizer<AdminsRolesPermissionsDTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<AdminsRolesPermissionsDTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<AdminsRolesPermissionsDTO>> {
    return {};
  }
}
