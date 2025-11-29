import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { AdminsRolesPermissionsEntity } from './admins-roles-permissions.entity';

@Injectable()
@QueryService(AdminsRolesPermissionsEntity)
export class AdminsRolesPermissionsService extends TypeOrmQueryService<AdminsRolesPermissionsEntity> {
  constructor(
    @InjectRepository(AdminsRolesPermissionsEntity) adminsRolesPermissionsRepo: Repository<AdminsRolesPermissionsEntity>,
  ) {
    super(adminsRolesPermissionsRepo, { useSoftDelete: true });
  }
}
