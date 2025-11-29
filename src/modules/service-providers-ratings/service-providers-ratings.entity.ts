import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import {
  SalesOrdersDTO,
  SalesOrdersEntity,
  ServiceProvidersDTO,
  ServiceProvidersEntity,
} from '@entities';
import { FilterableField, FilterableRelation } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@FilterableRelation('salesOrders', () => SalesOrdersDTO, { nullable: true })
@FilterableRelation('serviceProvider', () => ServiceProvidersDTO, { nullable: true })
@Entity('service_providers_ratings')
export class ServiceProvidersRatingsEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderId', unsigned: true, nullable: true })
  serviceProviderId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'salesOrderId', unsigned: true, nullable: true })
  salesOrderId: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'rate', nullable: true, unsigned: true, width: 1 })
  rate: number | null;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'comment', nullable: true })
  review: string | null;

  @ManyToOne(
    () => ServiceProvidersEntity,
    (serviceProvider) => serviceProvider.serviceProviderRatings,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'serviceProviderId', referencedColumnName: 'id' }])
  serviceProvider: ServiceProvidersEntity;

  @ManyToOne(() => SalesOrdersEntity, (serviceProvider) => serviceProvider.serviceProviderRatings, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'salesOrderId', referencedColumnName: 'id' }])
  salesOrders: SalesOrdersEntity;
}

@AppDtoDecorators(() => ServiceProvidersRatingsDTO)
export class ServiceProvidersRatingsDTO extends ServiceProvidersRatingsEntity { }
