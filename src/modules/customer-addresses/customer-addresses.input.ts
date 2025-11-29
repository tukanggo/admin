import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { CustomerAddressesDTO } from './customer-addresses.entity';

@InputType()
export class CreateCustomerAddressesInput {
  customerId?: number;
  name?: string;
  address?: string;
  addressDetail?: string;
  placeName?: string;
  city?: string;
  area?: string;
  remarks?: string;
  setDefault?: boolean;
}

@InputType()
export class UpdateCustomerAddressesInput extends PartialType(CreateCustomerAddressesInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class CustomerAddressesQuery extends QueryArgsType(CustomerAddressesDTO) {}
export const CustomerAddressesConnection = CustomerAddressesQuery.ConnectionType;

@ArgsType()
export class CustomFindOneCustomerAddressesArgs extends FindOneArgsType(CustomerAddressesDTO) {}

@InputType()
export class CustomCreateOneCustomerAddressesInput extends CreateOneInputType(
  'customerAddresses',
  CreateCustomerAddressesInput,
) {}

@InputType()
export class CustomCreateManyCustomerAddressesInput extends CreateManyInputType(
  'customerAddresses',
  CreateCustomerAddressesInput,
) {}

@InputType()
export class CustomUpdateOneCustomerAddressesInput extends UpdateOneInputType(
  CustomerAddressesDTO,
  UpdateCustomerAddressesInput,
) {}

@InputType()
export class CustomDeleteOneCustomerAddressesInput extends DeleteOneInputType(
  CustomerAddressesDTO,
) {}
