import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { HasOne } from '@base/app.nestjs-query';
import { ServiceProvidersDTO, ServiceProvidersEntity } from '@entities';
import { BeforeCreateMany, BeforeCreateOne, FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { serviceAreaCreateManyHook, serviceAreaCreateOneHook } from './service-area.hook';

@ObjectType()
@Entity('service_areas')
export class ServiceAreaEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'area', nullable: true, length: 200 })
  area: string | null;

  @FilterableField()
  @Column('int', { unsigned: true })
  serviceProviderId: number;

  @HasOne(() => ServiceProvidersDTO)
  @ManyToOne(() => ServiceProvidersEntity, (serviceProvider) => serviceProvider.serviceAreas, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'serviceProviderId', referencedColumnName: 'id' }])
  serviceProvider: ServiceProvidersEntity;
}

@BeforeCreateOne(serviceAreaCreateOneHook)
@BeforeCreateMany(serviceAreaCreateManyHook)
@AppDtoDecorators(() => ServiceAreaDTO)
export class ServiceAreaDTO extends ServiceAreaEntity {}

@AppDtoDecorators(() => AdminServiceAreaDTO)
export class AdminServiceAreaDTO extends ServiceAreaEntity {}
