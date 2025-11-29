import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { CustomerDTO, CustomersEntity } from '@entities';
import { FilterableField, FilterableRelation } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@FilterableRelation('customers', () => CustomerDTO)
@Entity('search_histories')
export class SearchHistoriesEntity extends AppBaseEntity {
  @FilterableField()
  @Column('int', { name: 'customerId', nullable: true, unsigned: true })
  customerId: number | null;

  @FilterableField()
  @Column('varchar', { name: 'keyword', nullable: true, length: 255 })
  keyword: string | null;

  @ManyToOne(() => CustomersEntity, (customers) => customers.searchHistories, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: CustomersEntity;
}

@AppDtoDecorators(() => SearchHistoriesDTO)
export class SearchHistoriesDTO extends SearchHistoriesEntity {}
