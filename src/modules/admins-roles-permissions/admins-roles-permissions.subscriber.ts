import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { AdminsRolesPermissionsEntity } from './admins-roles-permissions.entity';

@EventSubscriber()
export class AdminsRolesPermissionsSubscriber implements EntitySubscriberInterface<AdminsRolesPermissionsEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AdminsRolesPermissionsEntity;
  }
}
