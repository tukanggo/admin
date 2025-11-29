import { registerEnumType } from '@nestjs/graphql';

export enum serviceProviderTransactionEnum {
  TOP_UP = 'TOP_UP',
  SERVICE_TRANSACTION = 'SERVICE_TRANSACTION',
}

registerEnumType(serviceProviderTransactionEnum, { name: 'serviceProviderTransactionEnum' });
