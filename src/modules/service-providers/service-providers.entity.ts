import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { DTORelations, HasManyOffset } from '@base/app.nestjs-query';
import {
  DisbursementEntity,
  ProductDTO,
  ProductsEntity,
  SalesOrderMatchDTO,
  SalesOrderMatchesEntity,
  SalesOrderQuotationEntity,
  SalesOrdersEntity,
  ServiceAreaDTO,
  ServiceAreaEntity,
  ServiceProviderSalesOrderEntity,
  ServiceProvidersNotificationsEntity,
  ServiceProvidersRatingsDTO,
  ServiceProvidersRatingsEntity,
  ServiceProvidersTransactionEntity,
} from '@entities';
import { FilterableField, FilterableOffsetConnection } from '@nestjs-query/query-graphql';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { hashPassword } from '@providers/bcrypt.service';
import { AuthData } from '@types';
import { Exclude } from 'class-transformer';
import { FileUpload } from 'graphql-upload';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { ProviderTypeEnum } from './service-provider.enum';

@ObjectType()
@FilterableOffsetConnection('products', () => ProductDTO)
@FilterableOffsetConnection('salesOrderMatch', () => SalesOrderMatchDTO)
@FilterableOffsetConnection('serviceProviderRatings', () => ServiceProvidersRatingsDTO)
@Entity('service_providers')
export class ServiceProvidersEntity extends AppBaseEntity {
  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'profilePicture', nullable: true })
  profilePicture: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'personalIC', nullable: true, length: 20 })
  personalIC: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'officeNo', nullable: true, length: 20 })
  officeNo: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'employeeNo', nullable: true, length: 20 })
  employeeNo: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'companyName', nullable: true, length: 255 })
  companyName: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'companySSM', nullable: true, length: 100 })
  companySSM: string | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'companyDocument', nullable: true })
  companyDocument: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'fullName', nullable: true, length: 255 })
  fullName: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'jobTitle', nullable: true, length: 255 })
  jobTitle: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'serviceLocation', nullable: true, length: 200 })
  serviceLocation: string | null;

  @FilterableField(() => ProviderTypeEnum, { nullable: true })
  @Column('enum', {
    name: 'providerType',
    nullable: true,
    enum: ProviderTypeEnum,
  })
  providerType: ProviderTypeEnum;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'phoneCountryCode', nullable: true, length: 10 })
  phoneCountryCode: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'phoneNo', nullable: true, length: 40 })
  phoneNo: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', {
    name: 'email',
    nullable: true,
    length: 200,
  })
  email: string | null;

  @HideField()
  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'bankName', nullable: true, length: 200 })
  bankName: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'bankAccountNo', nullable: true, length: 50 })
  bankAccountNo: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'bankReceiver', nullable: true, length: 200 })
  bankReceiver: string | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'bankSupportingDocument', nullable: true })
  bankSupportingDocument: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'latitude',
    nullable: true,
    precision: 10,
    scale: 7,
  })
  latitude: number | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'longitude',
    nullable: true,
    precision: 10,
    scale: 7,
  })
  longitude: number | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'resetPasswordToken', nullable: true, length: 10 })
  resetPasswordToken: string | null;

  @FilterableField({ nullable: true })
  @Column('tinyint', {
    name: 'isActive',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isActive: boolean | null;

  @FilterableField({ nullable: true })
  @Column('tinyint', {
    name: 'isBanned',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isBanned: boolean | null;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'fcmToken', nullable: true })
  fcmToken: string | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @FilterableField(() => String, { nullable: true })
  @Column('varchar', { name: 'remark', nullable: true })
  remark: string | null;

  @FilterableField({ nullable: true })
  public rate: number | null;

  @OneToMany(() => ProductsEntity, (products) => products.serviceProvider, { nullable: true })
  products: ProductsEntity[];

  @OneToMany(
    () => ServiceProvidersNotificationsEntity,
    (serviceProviderNotifications) => serviceProviderNotifications.serviceProvider,
  )
  serviceProviderNotifications: ServiceProvidersNotificationsEntity[];

  @OneToMany(() => SalesOrdersEntity, (salesOrders) => salesOrders.serviceProvider)
  salesOrders: SalesOrdersEntity[];

  @OneToMany(
    () => ServiceProviderSalesOrderEntity,
    (serviceProviderSalesOrders) => serviceProviderSalesOrders.serviceProvider,
  )
  serviceProviderSalesOrders: ServiceProviderSalesOrderEntity[];

  @OneToMany(() => DisbursementEntity, (disbursements) => disbursements.serviceProvider)
  disbursements: DisbursementEntity[];

  @OneToMany(
    () => ServiceProvidersTransactionEntity,
    (serviceProviderTransactions) => serviceProviderTransactions.serviceProvider,
  )
  serviceProviderTransactions: ServiceProvidersTransactionEntity[];

  @OneToMany(
    () => SalesOrderQuotationEntity,
    (salesOrderQuotation) => salesOrderQuotation.serviceProviders,
  )
  salesOrderQuotation: SalesOrderQuotationEntity[];

  @OneToMany(() => SalesOrderMatchesEntity, (salesOrderMatch) => salesOrderMatch.serviceProvider)
  salesOrderMatch: SalesOrderMatchesEntity[];

  @HasManyOffset(() => ServiceAreaDTO)
  @OneToMany(() => ServiceAreaEntity, (serviceAreas) => serviceAreas.serviceProvider)
  serviceAreas: ServiceAreaEntity[];

  @OneToMany(
    () => ServiceProvidersRatingsEntity,
    (serviceProviderRatings) => serviceProviderRatings.serviceProvider,
  )
  serviceProviderRatings: ServiceProvidersRatingsEntity[];
}

@AppDtoDecorators(() => ServiceProvidersDTO)
export class ServiceProvidersDTO extends ServiceProvidersEntity {}

@ObjectType('getCreditBalanceDTO')
export class getCreditBalanceDTO {
  @Field() totalCreditBalance: number;
}

// @ObjectType('AdminGetTukangDTO')
// export class AdminGetTukangDTO extends ServiceProvidersDTO {
//   @Field() tukangService: number;
// }

@ObjectType('getMyOrderStatusDTO')
export class getMyOrderStatusDTO {
  @Field() totalRequest: number;
  @Field() totalMatching: number;
  @Field() totalActive: number;
  @Field() totalCompleted: number;
}
