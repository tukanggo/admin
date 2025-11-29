import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { ServiceProvidersTransactionEntity } from './service-providers-transaction.entity';

@EventSubscriber()
export class ServiceProvidersTransactionSubscriber implements EntitySubscriberInterface<ServiceProvidersTransactionEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ServiceProvidersTransactionEntity;
  }
}
