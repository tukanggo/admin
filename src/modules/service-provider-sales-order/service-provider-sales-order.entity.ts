import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { ServiceProvidersEntity, ServiceProvidersTransactionEntity } from '@entities';
import { PaymentStatusTypes } from '@modules/sales-orders/sales-orders.enum';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@ObjectType()
@Entity('service_provider_sales_orders')
export class ServiceProviderSalesOrderEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderId', unsigned: true, nullable: true })
  serviceProviderId: number | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'refNo', nullable: true, length: 20 })
  refNo: string | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    name: 'grandTotal',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  grandTotal: number | null;

  @FilterableField(() => PaymentStatusTypes)
  @Column('enum', {
    name: 'paymentStatus',
    nullable: true,
    default: PaymentStatusTypes.PENDING_PAYMENT,
    enum: PaymentStatusTypes,
  })
  paymentStatus: PaymentStatusTypes;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'paymentUrl', nullable: true })
  paymentUrl: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'remark', nullable: true })
  remark: string | null;

  @ManyToOne(
    () => ServiceProvidersEntity,
    (serviceProvider) => serviceProvider.serviceProviderSalesOrders,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'serviceProviderId', referencedColumnName: 'id' }])
  serviceProvider: ServiceProvidersEntity;

  @OneToMany(
    () => ServiceProvidersTransactionEntity,
    (serviceProviderTransactions) => serviceProviderTransactions.serviceProvider,
  )
  serviceProviderTransactions: ServiceProvidersTransactionEntity[];
}

@AppDtoDecorators(() => ServiceProviderSalesOrderDTO)
export class ServiceProviderSalesOrderDTO extends ServiceProviderSalesOrderEntity {}
