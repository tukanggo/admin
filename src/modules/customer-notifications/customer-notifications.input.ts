import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { CustomerNotificationsDTO } from './customer-notifications.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateCustomerNotificationsInput {
  customerId?: number;
  title?: string;
  content?: string;
  @Field(() => GraphQLUpload, { nullable: true }) thumbnail?: FileUpload;
  deeplink?: string;
  isRead?: boolean;
}

@InputType()
export class UpdateCustomerNotificationsInput extends PartialType(
  CreateCustomerNotificationsInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class CustomerNotificationsQuery extends QueryArgsType(CustomerNotificationsDTO) {}
export const CustomerNotificationsConnection = CustomerNotificationsQuery.ConnectionType;

@ArgsType()
export class CustomFindOneCustomerNotificationsArgs extends FindOneArgsType(
  CustomerNotificationsDTO,
) {}

@InputType()
export class CustomCreateOneCustomerNotificationsInput extends CreateOneInputType(
  'customerNotifications',
  CreateCustomerNotificationsInput,
) {}

@InputType()
export class CustomCreateManyCustomerNotificationsInput extends CreateManyInputType(
  'customerNotifications',
  CreateCustomerNotificationsInput,
) {}

@InputType()
export class CustomUpdateOneCustomerNotificationsInput extends UpdateOneInputType(
  CustomerNotificationsDTO,
  UpdateCustomerNotificationsInput,
) {}

@InputType()
export class CustomDeleteOneCustomerNotificationsInput extends DeleteOneInputType(
  CustomerNotificationsDTO,
) {}
