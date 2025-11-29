import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity('banners')
export class BannersEntity extends AppBaseEntity {
  @FilterableField()
  @Column('tinyint', {
    name: 'active',
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  active: boolean | null;

  @FilterableField()
  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  name: string | null;

  @FilterableField()
  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @FilterableField()
  @Column('longtext', { name: 'content', nullable: true })
  content: string | null;

  @FilterableField(() => String, { nullable: true })
  @Column('text', { name: 'bannerUrl', nullable: true })
  bannerUrl: string | FileUpload;

  @FilterableField({ nullable: true })
  @Column('text', { name: 'deeplink', nullable: true })
  deeplink: string | null;

  @FilterableField({ nullable: true })
  @Column('int', { name: 'arrangement', nullable: true, unsigned: true, width: 3 })
  arrangement: number | null;
}

@AppDtoDecorators(() => BannersDTO)
export class BannersDTO extends BannersEntity {}
