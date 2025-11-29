import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  AdminsRolesPermissionsDTO,
  AdminsRolesPermissionsEntity,
} from './admins-roles-permissions.entity';
import {
  CreateAdminsRolesPermissionsInput,
  UpdateAdminsRolesPermissionsInput,
} from './admins-roles-permissions.input';
import { AdminsRolesPermissionsResolver } from './admins-roles-permissions.resolver';
import { AdminsRolesPermissionsService } from './admins-roles-permissions.service';
import { AdminsRolesPermissionsSubscriber } from './admins-roles-permissions.subscriber';
import { AdminAuthGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([AdminsRolesPermissionsEntity])],
      services: [
        AdminsRolesPermissionsService,
        AdminsRolesPermissionsSubscriber,
        AdminsRolesPermissionsResolver,
      ],
      resolvers: [
        {
          ServiceClass: AdminsRolesPermissionsService,
          DTOClass: AdminsRolesPermissionsDTO,
          EntityClass: AdminsRolesPermissionsEntity,
          CreateDTOClass: CreateAdminsRolesPermissionsInput,
          UpdateDTOClass: UpdateAdminsRolesPermissionsInput,
          guards: [AdminAuthGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class AdminsRolesPermissionsModule {}
