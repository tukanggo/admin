import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { HasManyOffset, HasOne } from '@base/app.nestjs-query';
import {
  CustomerAddressesDTO,
  CustomerAddressesEntity,
  CustomerDTO,
  CustomerPointsDTO,
  CustomerPointsEntity,
  CustomersEntity,
  DisbursementEntity,
  OrderItemDTO,
  OrderItemsEntity,
  ProductCategoriesEntity,
  ProductCategoryDTO,
  ProductDTO,
  ProductsEntity,
  PromoCodeDTO,
  PromoCodesEntity,
  SalesOrderGalleriesEntity,
  SalesOrderGalleryDTO,
  SalesOrderMatchDTO,
  SalesOrderMatchesEntity,
  SalesOrderQuotationEntity,
  SalesOrderServiceProofDTO,
  SalesOrderServiceProofEntity,
  ServiceProvidersDTO,
  ServiceProvidersEntity,
  ServiceProvidersRatingsDTO,
  ServiceProvidersRatingsEntity,
  ServiceProvidersTransactionEntity,
} from '@entities';
import {
  Authorize,
  BeforeCreateOne,
  FilterableField,
  FilterableOffsetConnection,
  FilterableRelation,
} from '@nestjs-query/query-graphql';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { NumberList } from 'aws-sdk/clients/iot';
import { FileUpload } from 'graphql-upload';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { salesOrderCreateOneHook } from './sales-order.hook';
import { SalesOrdersAuthorizer } from './sales-orders.authorizer';
import { PaymentStatusTypes, SalesOrderStatusTypes } from './sales-orders.enum';
import { DisbursementStatusEnum } from './disbursement-status.enum';

@ObjectType()
@Entity('sales_orders')
@FilterableRelation('customer', () => CustomerDTO, { nullable: true })
@FilterableRelation('promoCode', () => PromoCodeDTO, { nullable: true })
@FilterableRelation('product', () => ProductDTO, { nullable: true })
@FilterableRelation('customerAddress', () => CustomerAddressesDTO, { nullable: true })
@FilterableRelation('serviceProvider', () => ServiceProvidersDTO, { nullable: true })
@FilterableRelation('salesOrderMatch', () => SalesOrderMatchDTO, { nullable: true })
@FilterableOffsetConnection('salesOrderMatches', () => SalesOrderMatchDTO, { nullable: true })
@FilterableOffsetConnection('serviceProviderRatings', () => ServiceProvidersRatingsDTO, {
  nullable: true,
})
@FilterableOffsetConnection('orderItems', () => OrderItemDTO, { nullable: true })
export class SalesOrdersEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('enum', { enum: DisbursementStatusEnum, default: DisbursementStatusEnum.PENDING })
  disbursementStatus: DisbursementStatusEnum;

  @FilterableField({ nullable: true })
  @Column('datetime', { nullable: true })
  disbursementDate: Date;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'customerId', nullable: true, unsigned: true })
  customerId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'promoCodeId', nullable: true, unsigned: true })
  promoCodeId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'disbursementId', nullable: true, unsigned: true })
  disbursementId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'productId', nullable: true, unsigned: true })
  productId: number | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'productName', nullable: true, length: 255 })
  productName: string;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'productType', nullable: true, length: 255 })
  productType: string;

  @FilterableField({ nullable: true })
  @Column('decimal', { name: 'productPrice', nullable: true, precision: 12, scale: 2 })
  productPrice: number;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'productCategory', nullable: true, length: 255 })
  productCategory: string;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderTransactionId', nullable: true, unsigned: true })
  serviceProviderTransactionId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'customerAddressId', nullable: true, unsigned: true })
  customerAddressId: number | null;

  @FilterableField()
  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @FilterableField()
  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @FilterableField()
  @Column('varchar', { name: 'placeName', nullable: true, length: 255 })
  placeName: string | null;

  @FilterableField()
  @Column('varchar', { name: 'area', nullable: true, length: 255 })
  area: string | null;

  @FilterableField()
  @Column('text', { name: 'addressDetail', nullable: true })
  addressDetail: string | null;

  @FilterableField()
  @Column('text', { name: 'remarks', nullable: true })
  remarks: string | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'salesOrderMatchId', nullable: true, unsigned: true })
  salesOrderMatchId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderId', unsigned: true, nullable: true })
  serviceProviderId: number | null;

  @FilterableField({ nullable: true })
  @Column('datetime', { name: 'preferredDateTime', nullable: true })
  preferredDateTime: Date | null;

  @FilterableField({ nullable: true })
  @Column('datetime', { name: 'alternativeDateTime', nullable: true })
  alternativeDateTime: Date | null;

  @FilterableField(() => SalesOrderStatusTypes, { nullable: true })
  @Column('enum', {
    name: 'salesOrderStatus',
    nullable: true,
    enum: SalesOrderStatusTypes,
  })
  salesOrderStatus: SalesOrderStatusTypes;

  @FilterableField(() => PaymentStatusTypes)
  @Column('enum', {
    name: 'paymentStatus',
    nullable: true,
    default: PaymentStatusTypes.PENDING_PAYMENT,
    enum: PaymentStatusTypes,
  })
  paymentStatus: PaymentStatusTypes;

  @FilterableField({ nullable: true })
  @Column('datetime', { name: 'matchValidity', nullable: true })
  matchValidity: Date | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'refNo', nullable: true, length: 20 })
  refNo: string | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'subtotal',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  subtotal: number | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'discountTotal',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  discountTotal: number | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'grandTotal',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  grandTotal: number | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'paymentUrl', nullable: true })
  paymentUrl: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'remark', nullable: true })
  remark: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { nullable: true })
  contactName?: string;

  @FilterableField({ nullable: true })
  @Column('varchar', { nullable: true })
  contactNo?: string;

  @OneToMany(() => OrderItemsEntity, (orderItems) => orderItems.salesOrder, { cascade: true })
  orderItems: OrderItemsEntity[];

  @OneToMany(() => SalesOrderMatchesEntity, (salesOrderMatches) => salesOrderMatches.salesOrder)
  salesOrderMatches: SalesOrderMatchesEntity[];

  @OneToMany(
    () => ServiceProvidersRatingsEntity,
    (serviceProviderRatings) => serviceProviderRatings.salesOrders,
  )
  serviceProviderRatings: ServiceProvidersRatingsEntity[];

  @HasManyOffset(() => SalesOrderGalleryDTO)
  @OneToMany(
    () => SalesOrderGalleriesEntity,
    (salesOrderGalleries) => salesOrderGalleries.salesOrders,
    {
      cascade: true,
    },
  )
  salesOrderGalleries: SalesOrderGalleriesEntity[];

  @OneToMany(
    () => SalesOrderQuotationEntity,
    (salesOrderQuotations) => salesOrderQuotations.salesOrders,
  )
  salesOrderQuotations: SalesOrderQuotationEntity[];

  @HasManyOffset(() => SalesOrderServiceProofDTO, { nullable: true })
  @OneToMany(
    () => SalesOrderServiceProofEntity,
    (salesOrderServiceProof) => salesOrderServiceProof.salesOrders,
  )
  salesOrderServiceProofs: SalesOrderQuotationEntity[];

  @HasManyOffset(() => CustomerPointsDTO, { nullable: true })
  @OneToMany(() => CustomerPointsEntity, (customerPoints) => customerPoints.salesOrder)
  customerPoints: CustomerPointsEntity[];

  @ManyToOne(() => PromoCodesEntity, (promoCode) => promoCode.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'promoCodeId', referencedColumnName: 'id' }])
  promoCode: PromoCodesEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: ProductsEntity;

  @Field(() => ProductDTO, { nullable: true })
  deletedProduct: ProductsEntity;
  @Field(() => ProductCategoryDTO, { nullable: true })
  deletedProductCategory: ProductCategoriesEntity;

  @ManyToOne(
    () => ServiceProvidersTransactionEntity,
    (serviceProviderTransaction) => serviceProviderTransaction.salesOrders,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'serviceProviderTransactionId', referencedColumnName: 'id' }])
  serviceProviderTransaction: ServiceProvidersTransactionEntity;

  @HasOne(() => CustomerDTO, { nullable: true })
  @ManyToOne(() => CustomersEntity, (customers) => customers.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'customerId' })
  customer: CustomersEntity;

  @ManyToOne(() => CustomerAddressesEntity, (customerAddress) => customerAddress.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customerAddressId', referencedColumnName: 'id' }])
  customerAddress: CustomerAddressesEntity;

  @ManyToOne(() => ServiceProvidersEntity, (serviceProvider) => serviceProvider.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'serviceProviderId', referencedColumnName: 'id' }])
  serviceProvider: ServiceProvidersEntity;

  @ManyToOne(() => DisbursementEntity, (disbursement) => disbursement.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'disbursementId', referencedColumnName: 'id' }])
  disbursement: DisbursementEntity;

  @ManyToOne(() => SalesOrderMatchesEntity, (salesOrderMatch) => salesOrderMatch.salesOrders, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'salesOrderMatchId', referencedColumnName: 'id' }])
  salesOrderMatch: SalesOrderMatchesEntity;
}

@BeforeCreateOne(salesOrderCreateOneHook)
@Authorize(SalesOrdersAuthorizer)
@AppDtoDecorators(() => SalesOrdersDTO)
export class SalesOrdersDTO extends SalesOrdersEntity {}

@ObjectType('GetMyJob')
export class GetMyJobDto {
  @FilterableField(() => [SalesOrdersDTO], { nullable: true }) nodes: SalesOrdersDTO[];
  @Field({ nullable: true }) totalCount: number;
}

@ObjectType('GetMyOrders')
export class GetMyOrdersDto {
  @FilterableField(() => [SalesOrdersDTO], { nullable: true }) nodes: SalesOrdersDTO[];
  @Field({ nullable: true }) totalCount: number;
}

@ObjectType('CheckPromoCode')
export class CheckPromoCodeDTO {
  @Field(() => ID) promoCodeId: number;
  @Field() isValidCode: boolean;
  @Field() isUsed: boolean;
  @Field(() => Int) quantity: number;
}

@ObjectType('dailyGrandTotal')
export class CheckDailyGrandTotalDTO {
  @Field() amount: number;
  @Field() date: Date;
}
