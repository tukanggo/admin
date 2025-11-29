import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { CustomersEntity, SalesOrdersEntity } from '@entities';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@ObjectType()
@Entity('customer_addresses')
export class CustomerAddressesEntity extends AppBaseEntity {
  @FilterableField()
  @Column('int', { name: 'customerId', nullable: true, unsigned: true })
  customerId: number | null;

  @FilterableField()
  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @FilterableField()
  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @FilterableField()
  @Column('varchar', { name: 'placeName', nullable: true, length: 255 })
  placeName: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'city', nullable: true, length: 255 })
  city: string | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'area', nullable: true, length: 255 })
  area: string | null;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'addressDetail', nullable: true })
  addressDetail: string | null;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'remarks', nullable: true })
  remarks: string | null;

  @FilterableField({ nullable: true })
  @Column('tinyint', {
    name: 'setDefault',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  setDefault: boolean | null;

  @OneToMany(() => SalesOrdersEntity, (salesOrders) => salesOrders.customerAddress)
  salesOrders: SalesOrdersEntity[];

  @ManyToOne(() => CustomersEntity, (customers) => customers.customerAddress, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: CustomersEntity;
}

@AppDtoDecorators(() => CustomerAddressesDTO)
export class CustomerAddressesDTO extends CustomerAddressesEntity {}
