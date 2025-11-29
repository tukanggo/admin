import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { ProductAreaOfServiceEntity } from '@entities';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

@ObjectType()
@Entity('area_of_services')
export class AreaOfServiceEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  area: string | null;

  @OneToMany(
    () => ProductAreaOfServiceEntity,
    (productAreaOfServices) => productAreaOfServices.areaOfService,
  )
  productAreaOfServices: ProductAreaOfServiceEntity[];
}

@AppDtoDecorators(() => AreaOfServiceDTO)
export class AreaOfServiceDTO extends AreaOfServiceEntity {}
