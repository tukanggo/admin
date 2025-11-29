import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { ServiceProvidersTransactionDTO } from './service-providers-transaction.entity';
import { serviceProviderTransactionEnum } from './service-provider-transaction.enum';

@InputType()
export class CreateServiceProvidersTransactionInput {
  serviceProviderId: number;
  serviceProviderSalesOrderId?: number;
  disbursementId?: number;
  type: serviceProviderTransactionEnum;
  amount: number;
  remark?: string;
}

@InputType()
export class UpdateServiceProvidersTransactionInput extends PartialType(
  CreateServiceProvidersTransactionInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class ServiceProvidersTransactionQuery extends QueryArgsType(
  ServiceProvidersTransactionDTO,
) {}
export const ServiceProvidersTransactionConnection =
  ServiceProvidersTransactionQuery.ConnectionType;

@ArgsType()
export class CustomFindOneServiceProvidersTransactionArgs extends FindOneArgsType(
  ServiceProvidersTransactionDTO,
) {}

@InputType()
export class CustomCreateOneServiceProvidersTransactionInput extends CreateOneInputType(
  'serviceProvidersTransaction',
  CreateServiceProvidersTransactionInput,
) {}

@InputType()
export class CustomCreateManyServiceProvidersTransactionInput extends CreateManyInputType(
  'serviceProvidersTransactions',
  CreateServiceProvidersTransactionInput,
) {}

@InputType()
export class CustomUpdateOneServiceProvidersTransactionInput extends UpdateOneInputType(
  ServiceProvidersTransactionDTO,
  UpdateServiceProvidersTransactionInput,
) {}

@InputType()
export class CustomDeleteOneServiceProvidersTransactionInput extends DeleteOneInputType(
  ServiceProvidersTransactionDTO,
) {}
