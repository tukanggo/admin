import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { ServiceProvidersRatingsDTO } from './service-providers-ratings.entity';

@InputType()
export class CreateServiceProvidersRatingsInput {
  serviceProviderId?: number;
  salesOrderId?: number;
  rate?: number;
  review?: string;
}

@InputType()
export class UpdateServiceProvidersRatingsInput extends PartialType(
  CreateServiceProvidersRatingsInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class ServiceProvidersRatingsQuery extends QueryArgsType(ServiceProvidersRatingsDTO) {}
export const ServiceProvidersRatingsConnection = ServiceProvidersRatingsQuery.ConnectionType;

@ArgsType()
export class CustomFindOneServiceProvidersRatingsArgs extends FindOneArgsType(
  ServiceProvidersRatingsDTO,
) {}

@InputType()
export class CustomCreateOneServiceProvidersRatingsInput extends CreateOneInputType(
  'serviceProvidersRatings',
  CreateServiceProvidersRatingsInput,
) {}

@InputType()
export class CustomCreateManyServiceProvidersRatingsInput extends CreateManyInputType(
  'serviceProvidersRatings',
  CreateServiceProvidersRatingsInput,
) {}

@InputType()
export class CustomUpdateOneServiceProvidersRatingsInput extends UpdateOneInputType(
  ServiceProvidersRatingsDTO,
  UpdateServiceProvidersRatingsInput,
) {}

@InputType()
export class CustomDeleteOneServiceProvidersRatingsInput extends DeleteOneInputType(
  ServiceProvidersRatingsDTO,
) {}
