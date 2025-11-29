import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { AdminsRolesPermissionsDTO } from './admins-roles-permissions.entity';
import {
  AdminsRolesPermissionsConnection,
  AdminsRolesPermissionsQuery,
  CustomCreateManyAdminsRolesPermissionsInput,
  CustomCreateOneAdminsRolesPermissionsInput,
  CustomDeleteOneAdminsRolesPermissionsInput,
  CustomFindOneAdminsRolesPermissionsArgs,
  CustomUpdateOneAdminsRolesPermissionsInput,
} from './admins-roles-permissions.input';
import { AdminsRolesPermissionsService } from './admins-roles-permissions.service';

@UseGuards()
@Resolver(() => AdminsRolesPermissionsDTO)
export class AdminsRolesPermissionsResolver {
  constructor(private readonly adminsRolesPermissionsService: AdminsRolesPermissionsService) {}

  @Query(() => AdminsRolesPermissionsConnection)
  async customQuery(@Args() query: AdminsRolesPermissionsQuery): Promise<ConnectionType<AdminsRolesPermissionsDTO>> {
    const filter: Filter<AdminsRolesPermissionsDTO> = {
      ...query.filter,
    };
    return AdminsRolesPermissionsConnection.createFromPromise((q) => this.adminsRolesPermissionsService.query(q), {
      ...query,
      ...{ filter },
    });
  }

  @Query(() => AdminsRolesPermissionsDTO)
  async customFindOneAdminsRolesPermissions(@Args() input: CustomFindOneAdminsRolesPermissionsArgs) {
    return null;
  }

  @Mutation(() => AdminsRolesPermissionsDTO)
  async customCreateOneAdminsRolesPermissions(
    @Args('input') input: CustomCreateOneAdminsRolesPermissionsInput,
  ): Promise<AdminsRolesPermissionsDTO> {
    return null;
  }

  @Mutation(() => [AdminsRolesPermissionsDTO])
  async customCreateManyAdminsRolesPermissions(
    @Args('input') input: CustomCreateManyAdminsRolesPermissionsInput,
  ): Promise<AdminsRolesPermissionsDTO> {
    return null;
  }

  @Mutation(() => AdminsRolesPermissionsDTO)
  async customUpdateOneAdminsRolesPermissions(
    @Args('input') input: CustomUpdateOneAdminsRolesPermissionsInput,
  ): Promise<AdminsRolesPermissionsDTO> {
    return null;
  }

  @Mutation(() => AdminsRolesPermissionsDTO)
  async customDeleteOneAdminsRolesPermissions(
    @Args('input') input: CustomDeleteOneAdminsRolesPermissionsInput,
  ): Promise<AdminsRolesPermissionsDTO> {
    return null;
  }
}
