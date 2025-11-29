import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { AreaOfServiceEntity } from './area-of-service.entity';

@EventSubscriber()
export class AreaOfServiceSubscriber implements EntitySubscriberInterface<AreaOfServiceEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AreaOfServiceEntity;
  }
}
