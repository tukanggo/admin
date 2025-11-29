import {
  ArgsType,
  Field,
  ID,
  InputType,
  OmitType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { SalesOrdersDTO } from './sales-orders.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { filerStatusEnum, PaymentStatusTypes, SalesOrderStatusTypes } from './sales-orders.enum';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDTO } from '@entities';
import { CreateOrderItemsInput } from '@modules/order-items';
import { CreateSalesOrderGalleriesInput } from '@modules/sales-order-galleries';
import { DisbursementStatusEnum } from './disbursement-status.enum';

@InputType()
export class CreateRelationOrderItemsInputDTO extends OmitType(CreateOrderItemsInput, [
  'salesOrderId',
] as const) {}

@InputType()
export class UpdateRelationOrderItemsInputDTO extends PartialType(
  CreateRelationOrderItemsInputDTO,
) {
  id?: number;
}

@InputType()
export class CreateRelationSalesOrderFilesInputDTO extends OmitType(
  CreateSalesOrderGalleriesInput,
  ['salesOrderId'] as const,
) {}

@InputType()
export class UpdateRelationSalesOrderFilesInputDTO extends PartialType(
  CreateRelationSalesOrderFilesInputDTO,
) {
  id?: number;
}

@InputType()
export class CreateSalesOrdersInput {
  customerId?: number;
  promoCodeId?: number;
  productId?: number;
  serviceProviderId?: number;
  customerAddressId?: number;
  disbursementId?: number;
  name?: string;
  address?: string;
  placeName?: string;
  area?: string;
  addressDetails?: string;
  remarks?: string;
  salesOrderMatchId?: number;
  preferredDateTime?: Date;
  alternativeDateTime?: Date;
  salesOrderStatus?: SalesOrderStatusTypes;
  paymentStatus?: PaymentStatusTypes;
  matchValidity?: Date;
  // refNo?: string;
  subtotal?: number;
  discountTotal?: number;
  grandTotal?: number;
  remark?: string;
  disbursementDate?: string;
  disbursementStatus?: DisbursementStatusEnum;
  @Field(() => GraphQLUpload, { nullable: true }) paymentUrl: FileUpload;
}

@InputType()
export class CustomBookQuotationInput {
  customerId?: number;
  promoCodeId?: number;
  productId?: number;
  serviceProviderId?: number;
  customerAddressId?: number;
  disbursementId?: number;
  // name?: string;
  // address?: string;
  // placeName?: string;
  // area?: string;
  // addressDetails?: string;
  remarks?: string;
  salesOrderMatchId?: number;
  preferredDateTime?: Date;
  alternativeDateTime?: Date;
  salesOrderStatus?: SalesOrderStatusTypes;
  paymentStatus?: PaymentStatusTypes;
  matchValidity?: Date;
  refNo?: string;
  subtotal?: number;
  discountTotal?: number;
  grandTotal?: number;
  remark?: string;
  @Field(() => [CreateRelationOrderItemsInputDTO]) orderItems: CreateRelationOrderItemsInputDTO[];
  @Field(() => [CreateRelationSalesOrderFilesInputDTO], { nullable: true })
  salesOrderFiles: CreateRelationSalesOrderFilesInputDTO[];
  @Field(() => GraphQLUpload, { nullable: true }) paymentUrl: FileUpload;
}

@InputType()
export class exportSalesOrderReportInput {
  @ApiProperty({ example: 'PENDING_PAYMENT' })
  salesOrderStatus?: SalesOrderStatusTypes;

  @ApiProperty({ example: 'PAID' })
  paymentStatus?: PaymentStatusTypes;

  @ApiProperty({ example: '2022-12-29 00:00:00' })
  startDate?: Date;

  @ApiProperty({ example: '2022-12-29 23:59:59' })
  endDate?: Date;
}

@InputType()
export class CustomSalesOrderInput {
  filterSalesOrderStatus: filerStatusEnum;
  limit: number;
  offset: number;
}

@InputType()
export class filterDateInput {
  startDate?: Date;
  endDate?: Date;
  productCategoryId?: number;
  limit: number;
  offset: number;
}

@InputType()
export class updateSalesOrderStatusInput {
  salesOrderStatus: SalesOrderStatusTypes;
  @Field(() => ID) salesOrderId: number;
  @Field(() => [UpdateRelationOrderItemsInputDTO], { nullable: true })
  orderItems: UpdateRelationOrderItemsInputDTO[];
  @Field(() => [UpdateRelationSalesOrderFilesInputDTO], { nullable: true })
  salesOrderFiles: UpdateRelationSalesOrderFilesInputDTO[];
  // @Field(() => [salesOrderProofFileInput], { nullable: true }) file: salesOrderProofFileInput[];
}

@InputType()
export class salesOrderProofFileInput {
  @Field(() => GraphQLUpload, { nullable: true }) salesOrderServiceProofImage: FileUpload;
}

@InputType()
export class UpdateSalesOrdersInput extends PartialType(CreateSalesOrdersInput) {
  contactName?: string;
  contactNo?: string;
}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class SalesOrdersQuery extends QueryArgsType(SalesOrdersDTO) {}
export const SalesOrdersConnection = SalesOrdersQuery.ConnectionType;

@ArgsType()
export class CustomFindOneSalesOrdersArgs extends FindOneArgsType(SalesOrdersDTO) {}

@InputType()
export class CustomCreateOneSalesOrdersInput extends CreateOneInputType(
  'salesOrders',
  CreateSalesOrdersInput,
) {
  @Field(() => [CreateOrderItemsInput]) orderItems: CreateOrderItemsInput[];
}

@InputType()
export class CustomCreateManySalesOrdersInput extends CreateManyInputType(
  'salesOrders',
  CreateSalesOrdersInput,
) {}

@InputType()
export class CustomUpdateOneSalesOrdersInput extends UpdateOneInputType(
  SalesOrdersDTO,
  UpdateSalesOrdersInput,
) {}

@InputType()
export class CustomDeleteOneSalesOrdersInput extends DeleteOneInputType(SalesOrdersDTO) {}
