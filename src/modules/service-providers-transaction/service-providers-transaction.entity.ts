import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import {
  DisbursementEntity,
  SalesOrdersEntity,
  ServiceProviderSalesOrderEntity,
  ServiceProvidersDTO,
  ServiceProvidersEntity,
} from '@entities';
import { FilterableField, FilterableRelation } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { serviceProviderTransactionEnum } from './service-provider-transaction.enum';

@ObjectType()
@Entity('service_providers_transactions')
@FilterableRelation('serviceProvider', () => ServiceProvidersDTO, { nullable: true })
export class ServiceProvidersTransactionEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('int', { name: 'disbursementId', nullable: true, unsigned: true })
  disbursementId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderId', unsigned: true, nullable: true })
  serviceProviderId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderSalesOrderId', unsigned: true, nullable: true })
  serviceProviderSalesOrderId: number | null;

  @FilterableField()
  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: serviceProviderTransactionEnum,
  })
  type: serviceProviderTransactionEnum;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'amount',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  amount: number | null;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'remark', nullable: true })
  remark: string | null;

  @OneToMany(() => SalesOrdersEntity, (salesOrders) => salesOrders.serviceProviderTransaction)
  salesOrders: SalesOrdersEntity[];

  @ManyToOne(
    () => ServiceProvidersEntity,
    (serviceProvider) => serviceProvider.serviceProviderTransactions,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'serviceProviderId', referencedColumnName: 'id' }])
  serviceProvider: ServiceProvidersEntity;

  @ManyToOne(
    () => ServiceProviderSalesOrderEntity,
    (serviceProviderSalesOrder) => serviceProviderSalesOrder.serviceProviderTransactions,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'serviceProviderSalesOrderId', referencedColumnName: 'id' }])
  serviceProviderSalesOrder: ServiceProviderSalesOrderEntity;

  @ManyToOne(() => DisbursementEntity, (disbursement) => disbursement.serviceProviderTransactions, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'disbursementId', referencedColumnName: 'id' }])
  disbursement: DisbursementEntity;
}

@AppDtoDecorators(() => ServiceProvidersTransactionDTO)
export class ServiceProvidersTransactionDTO extends ServiceProvidersTransactionEntity {}
