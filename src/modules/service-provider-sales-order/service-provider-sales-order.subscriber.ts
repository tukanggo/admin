import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { ServiceProviderSalesOrderEntity } from './service-provider-sales-order.entity';

@EventSubscriber()
export class ServiceProviderSalesOrderSubscriber implements EntitySubscriberInterface<ServiceProviderSalesOrderEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ServiceProviderSalesOrderEntity;
  }
}
