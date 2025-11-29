import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity('admins_roles_permissions')
export class AdminsRolesPermissionsEntity extends AppBaseEntity {
  @FilterableField()
  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: ['STAFF', 'SUPER_ADMIN'],
  })
  type: 'STAFF' | 'SUPER_ADMIN' | null;

  @FilterableField()
  @Column('varchar', { name: 'permissions', nullable: true, length: 50 })
  permissions: string | null;
}

@AppDtoDecorators(() => AdminsRolesPermissionsDTO)
export class AdminsRolesPermissionsDTO extends AdminsRolesPermissionsEntity {}
