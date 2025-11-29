import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { SalesOrderServiceProofDTO } from './sales-order-service-proof.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateSalesOrderServiceProofInput {
  salesOrderId?: number;
  @Field(() => GraphQLUpload) imageUrl?: FileUpload;
}

@InputType()
export class UpdateSalesOrderServiceProofInput extends PartialType(
  CreateSalesOrderServiceProofInput,
) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class SalesOrderServiceProofQuery extends QueryArgsType(SalesOrderServiceProofDTO) {}
export const SalesOrderServiceProofConnection = SalesOrderServiceProofQuery.ConnectionType;

@ArgsType()
export class CustomFindOneSalesOrderServiceProofArgs extends FindOneArgsType(
  SalesOrderServiceProofDTO,
) {}

@InputType()
export class CustomCreateOneSalesOrderServiceProofInput extends CreateOneInputType(
  'salesOrderServiceProof',
  CreateSalesOrderServiceProofInput,
) {}

@InputType()
export class CustomCreateManySalesOrderServiceProofInput extends CreateManyInputType(
  'salesOrderServiceProofs',
  CreateSalesOrderServiceProofInput,
) {}

@InputType()
export class CustomUpdateOneSalesOrderServiceProofInput extends UpdateOneInputType(
  SalesOrderServiceProofDTO,
  UpdateSalesOrderServiceProofInput,
) {}

@InputType()
export class CustomDeleteOneSalesOrderServiceProofInput extends DeleteOneInputType(
  SalesOrderServiceProofDTO,
) {}
