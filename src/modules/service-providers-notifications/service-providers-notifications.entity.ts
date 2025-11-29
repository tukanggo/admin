import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { ServiceProvidersEntity } from '@entities';
import { Authorize, FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ServiceProvidersNotificationsAuthorizer } from './service-providers-notifications.authorizer';

@ObjectType()
@Entity('service_providers_notifications')
export class ServiceProvidersNotificationsEntity extends AppBaseEntity {
  @FilterableField({ nullable: true })
  @Column('int', { name: 'serviceProviderId', nullable: true, unsigned: true })
  serviceProviderId: number | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @FilterableField({ nullable: true })
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

  @ManyToOne(
    () => ServiceProvidersEntity,
    (serviceProvider) => serviceProvider.serviceProviderNotifications,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'serviceProviderId', referencedColumnName: 'id' }])
  serviceProvider: ServiceProvidersEntity;
}

@Authorize(ServiceProvidersNotificationsAuthorizer)
@AppDtoDecorators(() => ServiceProvidersNotificationsDTO)
export class ServiceProvidersNotificationsDTO extends ServiceProvidersNotificationsEntity {}
