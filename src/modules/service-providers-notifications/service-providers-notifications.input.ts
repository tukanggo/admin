import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { ServiceProvidersNotificationsDTO } from './service-providers-notifications.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateServiceProvidersNotificationsInput {
  serviceProviderId?: number;
  title?: string;
  content?: string;
  @Field(() => GraphQLUpload, { nullable: true }) thumbnail?: FileUpload;
  deeplink?: string;
  isRead?: boolean;
}

@InputType()
export class UpdateServiceProvidersNotificationsInput extends PartialType(
  CreateServiceProvidersNotificationsInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class ServiceProvidersNotificationsQuery extends QueryArgsType(
  ServiceProvidersNotificationsDTO,
) {}
export const ServiceProvidersNotificationsConnection =
  ServiceProvidersNotificationsQuery.ConnectionType;

@ArgsType()
export class CustomFindOneServiceProvidersNotificationsArgs extends FindOneArgsType(
  ServiceProvidersNotificationsDTO,
) {}

@InputType()
export class CustomCreateOneServiceProvidersNotificationsInput extends CreateOneInputType(
  'serviceProvidersNotifications',
  CreateServiceProvidersNotificationsInput,
) {}

@InputType()
export class CustomCreateManyServiceProvidersNotificationsInput extends CreateManyInputType(
  'serviceProvidersNotifications',
  CreateServiceProvidersNotificationsInput,
) {}

@InputType()
export class CustomUpdateOneServiceProvidersNotificationsInput extends UpdateOneInputType(
  ServiceProvidersNotificationsDTO,
  UpdateServiceProvidersNotificationsInput,
) {}

@InputType()
export class CustomDeleteOneServiceProvidersNotificationsInput extends DeleteOneInputType(
  ServiceProvidersNotificationsDTO,
) {}
