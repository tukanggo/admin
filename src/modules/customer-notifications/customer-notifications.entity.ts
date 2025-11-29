import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { CustomersEntity } from '@entities';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('customer_notifications')
export class CustomerNotificationsEntity extends AppBaseEntity {
  @FilterableField()
  @Column('int', { name: 'customerId', nullable: true, unsigned: true })
  customerId: number | null;

  @FilterableField()
  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @FilterableField()
  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'thumbnail', nullable: true })
  thumbnail: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'deeplink', nullable: true })
  deeplink: string | null;

  @FilterableField()
  @Column('tinyint', {
    name: 'isRead',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isRead: boolean | null;

  @ManyToOne(() => CustomersEntity, (customers) => customers.customerNotification, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: CustomersEntity;
}

@AppDtoDecorators(() => CustomerNotificationsDTO)
export class CustomerNotificationsDTO extends CustomerNotificationsEntity {}
