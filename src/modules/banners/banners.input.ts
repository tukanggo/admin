import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { BannersDTO } from './banners.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateBannersInput {
  active?: boolean;
  name: string;
  @Field(() => GraphQLUpload) bannerUrl: FileUpload;
  title: string;
  content?: string;
  deeplink?: string;
  arrangement?: number;
}

@InputType()
export class UpdateBannersInput extends PartialType(CreateBannersInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class BannersQuery extends QueryArgsType(BannersDTO) {}
export const BannersConnection = BannersQuery.ConnectionType;

@ArgsType()
export class CustomFindOneBannersArgs extends FindOneArgsType(BannersDTO) {}

@InputType()
export class CustomCreateOneBannersInput extends CreateOneInputType(
  'banners',
  CreateBannersInput,
) {}

@InputType()
export class CustomCreateManyBannersInput extends CreateManyInputType(
  'banners',
  CreateBannersInput,
) {}

@InputType()
export class CustomUpdateOneBannersInput extends UpdateOneInputType(
  BannersDTO,
  UpdateBannersInput,
) {}

@InputType()
export class CustomDeleteOneBannersInput extends DeleteOneInputType(BannersDTO) {}
