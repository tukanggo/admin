import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { CustomerAddressesEntity } from './customer-addresses.entity';

@Injectable()
@QueryService(CustomerAddressesEntity)
export class CustomerAddressesService extends TypeOrmQueryService<CustomerAddressesEntity> {
  constructor(
    @InjectRepository(CustomerAddressesEntity)
    customerAddressesRepo: Repository<CustomerAddressesEntity>,
  ) {
    super(customerAddressesRepo, { useSoftDelete: true });
  }
}
