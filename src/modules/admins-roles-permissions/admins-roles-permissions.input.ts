/* eslint-disable max-len */
import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { AdminsRolesPermissionsDTO } from './admins-roles-permissions.entity';

@InputType()
export class CreateAdminsRolesPermissionsInput {
  // type: 'STAFF' | 'SUPER_ADMIN';
  type: string;
  permissions: string;
}

@InputType()
export class UpdateAdminsRolesPermissionsInput extends PartialType(
  CreateAdminsRolesPermissionsInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class AdminsRolesPermissionsQuery extends QueryArgsType(AdminsRolesPermissionsDTO) {}
export const AdminsRolesPermissionsConnection = AdminsRolesPermissionsQuery.ConnectionType;

@ArgsType()
export class CustomFindOneAdminsRolesPermissionsArgs extends FindOneArgsType(
  AdminsRolesPermissionsDTO,
) {}

@InputType()
export class CustomCreateOneAdminsRolesPermissionsInput extends CreateOneInputType(
  'adminsRolesPermissions',
  CreateAdminsRolesPermissionsInput,
) {}

@InputType()
export class CustomCreateManyAdminsRolesPermissionsInput extends CreateManyInputType(
  'adminsRolesPermissions',
  CreateAdminsRolesPermissionsInput,
) {}

@InputType()
export class CustomUpdateOneAdminsRolesPermissionsInput extends UpdateOneInputType(
  AdminsRolesPermissionsDTO,
  UpdateAdminsRolesPermissionsInput,
) {}

@InputType()
export class CustomDeleteOneAdminsRolesPermissionsInput extends DeleteOneInputType(
  AdminsRolesPermissionsDTO,
) {}
