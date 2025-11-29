import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { SettingsDTO } from './settings.entity';

@InputType()
export class CreateSettingsInput {
  vatPercentage?: number;
  vatName?: string;
  creditForQuotation?: number;
  creditForInstantBook?: number;
  quotationTukangCharges?: number;
  instantBookTukangCharges?: number;
}

@InputType()
export class UpdateSettingsInput extends PartialType(CreateSettingsInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class SettingsQuery extends QueryArgsType(SettingsDTO) {}
export const SettingsConnection = SettingsQuery.ConnectionType;

@ArgsType()
export class CustomFindOneSettingsArgs extends FindOneArgsType(SettingsDTO) {}

@InputType()
export class CustomCreateOneSettingsInput extends CreateOneInputType(
  'settings',
  CreateSettingsInput,
) {}

@InputType()
export class CustomCreateManySettingsInput extends CreateManyInputType(
  'settings',
  CreateSettingsInput,
) {}

@InputType()
export class CustomUpdateOneSettingsInput extends UpdateOneInputType(
  SettingsDTO,
  UpdateSettingsInput,
) {}

@InputType()
export class CustomDeleteOneSettingsInput extends DeleteOneInputType(SettingsDTO) {}
