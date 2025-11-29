import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { ServiceAreaDTO } from './service-area.entity';

@InputType()
export class CreateServiceAreaInput {
  area: string;
}

@InputType()
export class UpdateServiceAreaInput extends PartialType(CreateServiceAreaInput) {}

@InputType()
export class AdminCreateServiceAreaInput {
  area: string;
  serviceProviderId: number;
}

@InputType()
export class AdminUpdateServiceAreaInput extends PartialType(AdminCreateServiceAreaInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class ServiceAreaQuery extends QueryArgsType(ServiceAreaDTO) {}
export const ServiceAreaConnection = ServiceAreaQuery.ConnectionType;

@ArgsType()
export class CustomFindOneServiceAreaArgs extends FindOneArgsType(ServiceAreaDTO) {}

@InputType()
export class CustomCreateOneServiceAreaInput extends CreateOneInputType(
  'serviceArea',
  CreateServiceAreaInput,
) {}

@InputType()
export class CustomCreateManyServiceAreaInput extends CreateManyInputType(
  'serviceAreas',
  CreateServiceAreaInput,
) {}

@InputType()
export class CustomUpdateOneServiceAreaInput extends UpdateOneInputType(
  ServiceAreaDTO,
  UpdateServiceAreaInput,
) {}

@InputType()
export class CustomDeleteOneServiceAreaInput extends DeleteOneInputType(ServiceAreaDTO) {}
