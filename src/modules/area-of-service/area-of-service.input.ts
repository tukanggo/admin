import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { AreaOfServiceDTO } from './area-of-service.entity';

@InputType()
export class CreateAreaOfServiceInput {
  area: string;
}

@InputType()
export class UpdateAreaOfServiceInput extends PartialType(CreateAreaOfServiceInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class AreaOfServiceQuery extends QueryArgsType(AreaOfServiceDTO) {}
export const AreaOfServiceConnection = AreaOfServiceQuery.ConnectionType;

@ArgsType()
export class CustomFindOneAreaOfServiceArgs extends FindOneArgsType(AreaOfServiceDTO) {}

@InputType()
export class CustomCreateOneAreaOfServiceInput extends CreateOneInputType(
  'areaOfService',
  CreateAreaOfServiceInput,
) {}

@InputType()
export class CustomCreateManyAreaOfServiceInput extends CreateManyInputType(
  'areaOfServices',
  CreateAreaOfServiceInput,
) {}

@InputType()
export class CustomUpdateOneAreaOfServiceInput extends UpdateOneInputType(
  AreaOfServiceDTO,
  UpdateAreaOfServiceInput,
) {}

@InputType()
export class CustomDeleteOneAreaOfServiceInput extends DeleteOneInputType(AreaOfServiceDTO) {}
