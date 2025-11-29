import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { ServiceProviderSalesOrderDTO } from './service-provider-sales-order.entity';

@InputType()
export class CreateServiceProviderSalesOrderInput {
  serviceProviderId: number;
  grandTotal: number;
  remark?: number;
}

@InputType()
export class CreateSPSalesOrderInput {
  topUpAmount: number;
}

@InputType()
export class UpdateServiceProviderSalesOrderInput extends PartialType(
  CreateServiceProviderSalesOrderInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class ServiceProviderSalesOrderQuery extends QueryArgsType(ServiceProviderSalesOrderDTO) {}
export const ServiceProviderSalesOrderConnection = ServiceProviderSalesOrderQuery.ConnectionType;

@ArgsType()
export class CustomFindOneServiceProviderSalesOrderArgs extends FindOneArgsType(
  ServiceProviderSalesOrderDTO,
) {}

@InputType()
export class CustomCreateOneServiceProviderSalesOrderInput extends CreateOneInputType(
  'serviceProviderSalesOrder',
  CreateServiceProviderSalesOrderInput,
) {}

@InputType()
export class CustomCreateManyServiceProviderSalesOrderInput extends CreateManyInputType(
  'serviceProviderSalesOrders',
  CreateServiceProviderSalesOrderInput,
) {}

@InputType()
export class CustomUpdateOneServiceProviderSalesOrderInput extends UpdateOneInputType(
  ServiceProviderSalesOrderDTO,
  UpdateServiceProviderSalesOrderInput,
) {}

@InputType()
export class CustomDeleteOneServiceProviderSalesOrderInput extends DeleteOneInputType(
  ServiceProviderSalesOrderDTO,
) {}
