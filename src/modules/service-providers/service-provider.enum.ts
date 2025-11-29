import { registerEnumType } from '@nestjs/graphql';

export enum ProviderTypeEnum {
  FREELANCE = 'FREELANCE',
  COMPANY = 'COMPANY',
}

registerEnumType(ProviderTypeEnum, { name: 'ProviderTypeEnum' });

export enum getTukangFieldTypesEnum {
  PROVIDER_TYPE = 's.providerType',
  COMPANY_NAME = 's.companyName',
}
registerEnumType(getTukangFieldTypesEnum, { name: 'getTukangFieldTypesEnum' });
