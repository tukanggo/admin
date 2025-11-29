import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { ServiceAreaEntity } from './service-area.entity';

@EventSubscriber()
export class ServiceAreaSubscriber implements EntitySubscriberInterface<ServiceAreaEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ServiceAreaEntity;
  }
}
