import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { SearchHistoriesDTO } from './search-histories.entity';

@InputType()
export class CreateSearchHistoriesInput {
  customerId?: number;
  keyword?: string;
}

@InputType()
export class UpdateSearchHistoriesInput extends PartialType(CreateSearchHistoriesInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class SearchHistoriesQuery extends QueryArgsType(SearchHistoriesDTO) {}
export const SearchHistoriesConnection = SearchHistoriesQuery.ConnectionType;

@ArgsType()
export class CustomFindOneSearchHistoriesArgs extends FindOneArgsType(SearchHistoriesDTO) {}

@InputType()
export class CustomCreateOneSearchHistoriesInput extends CreateOneInputType(
  'searchHistories',
  CreateSearchHistoriesInput,
) {}

@InputType()
export class CustomCreateManySearchHistoriesInput extends CreateManyInputType(
  'searchHistories',
  CreateSearchHistoriesInput,
) {}

@InputType()
export class CustomUpdateOneSearchHistoriesInput extends UpdateOneInputType(
  SearchHistoriesDTO,
  UpdateSearchHistoriesInput,
) {}

@InputType()
export class CustomDeleteOneSearchHistoriesInput extends DeleteOneInputType(SearchHistoriesDTO) {}
