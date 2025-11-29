import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity('settings')
export class SettingsEntity extends AppBaseEntity {
  @FilterableField()
  @Column('decimal', {
    name: 'vatPercentage',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  vatPercentage: number | null;

  @FilterableField({ nullable: true })
  @Column('varchar', { name: 'vatName', nullable: true, length: 50 })
  vatName: string | null;

  @FilterableField({ nullable: true })
  @Column('int', { nullable: true })
  creditForQuotation: number | null;

  @FilterableField({ nullable: true })
  @Column('int', { nullable: true })
  creditForInstantBook: number | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    nullable: true,
    precision: 12,
    scale: 2,
  })
  quotationTukangCharges: number | null;

  @FilterableField({ nullable: true })
  @Column('decimal', {
    nullable: true,
    precision: 12,
    scale: 2,
  })
  instantBookTukangCharges: number | null;
}

@AppDtoDecorators(() => SettingsDTO)
export class SettingsDTO extends SettingsEntity {}
