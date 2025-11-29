import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { SalesOrdersEntity } from '@entities';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('sales_order_service_proofs')
export class SalesOrderServiceProofEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('int', { name: 'salesOrderId', unsigned: true, nullable: true })
  salesOrderId: number | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'imageUrl', nullable: true })
  imageUrl: string | FileUpload;

  @ManyToOne(() => SalesOrdersEntity, (salesOrders) => salesOrders.salesOrderServiceProofs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'salesOrderId', referencedColumnName: 'id' }])
  salesOrders: SalesOrdersEntity;
}

@AppDtoDecorators(() => SalesOrderServiceProofDTO)
export class SalesOrderServiceProofDTO extends SalesOrderServiceProofEntity {}
