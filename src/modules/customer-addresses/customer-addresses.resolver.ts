import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

import { CustomerAddressesDTO } from './customer-addresses.entity';
import { CustomerAddressesService } from './customer-addresses.service';

@UseGuards()
@Resolver(() => CustomerAddressesDTO)
export class CustomerAddressesResolver {
  constructor(private readonly customerAddressesService: CustomerAddressesService) {}
}
