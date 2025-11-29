import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Not,
  UpdateEvent,
} from 'typeorm';

import { CustomerAddressesEntity } from './customer-addresses.entity';

@EventSubscriber()
export class CustomerAddressesSubscriber
  implements EntitySubscriberInterface<CustomerAddressesEntity>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return CustomerAddressesEntity;
  }

  async beforeInsert(event: InsertEvent<CustomerAddressesEntity>) {
    const { entity } = event;

    if (entity.setDefault === true) {
      await event.manager
        .getRepository(CustomerAddressesEntity)
        .update({ customerId: entity.customerId }, { setDefault: false });
    }
  }
  async beforeUpdate(event: UpdateEvent<CustomerAddressesEntity>) {
    const { entity } = event;
    if (!entity.id) return;

    const customerAddresses = await event.manager
      .getRepository(CustomerAddressesEntity)
      .findOne({ where: { id: entity.id } });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (entity.setDefault === true && customerAddresses.setDefault === 0) {
      await event.manager
        .getRepository(CustomerAddressesEntity)
        .update({ id: Not(entity.id), customerId: entity.customerId }, { setDefault: false });
    }
  }

  async afterInsert(event: InsertEvent<CustomerAddressesEntity>) {
    const { entity } = event;
    const data = await event.manager
      .getRepository(CustomerAddressesEntity)
      .findOneBy({ id: entity.id });

    const addressData = await event.manager
      .getRepository(CustomerAddressesEntity)
      .count({ where: { customerId: entity.customerId } });

    if (addressData === 1) {
      data.setDefault = true;

      await event.manager.getRepository(CustomerAddressesEntity).save(data);
    }
  }
}
