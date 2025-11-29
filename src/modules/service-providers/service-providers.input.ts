import { ArgsType, Field, ID, InputType, PartialType, registerEnumType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { ServiceProvidersDTO } from './service-providers.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { SalesOrderMatchesTypes } from '@modules/sales-order-matches/sales-order-matches-enum';
import { ProviderTypeEnum } from './service-provider.enum';

enum jobStatusTypesEnum {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
  ALL = 'ALL',
}

registerEnumType(jobStatusTypesEnum, { name: 'jobStatusTypes' });

@InputType()
export class CreateServiceProvidersInput {
  @Field(() => GraphQLUpload, { nullable: true }) profilePicture?: FileUpload;
  @Field(() => GraphQLUpload, { nullable: true }) companyDocument?: FileUpload;
  @Field(() => GraphQLUpload, { nullable: true }) bankSupportingDocument?: FileUpload;
  address?: string;
  providerType?: ProviderTypeEnum;
  personalIC?: string;
  officeNo?: string;
  employeeNo?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankReceiver?: string;
  companyName?: string;
  companySSM?: string;
  fullName?: string;
  jobTitle?: string;
  phoneCountryCode?: string;
  phoneNo?: string;
  email?: string;
  password?: string;
  resetPasswordToken?: string;
  serviceLocation?: string;
  isActive?: boolean;
  isBanned?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
  remark?: string;
}

@InputType()
export class registerServiceProvidersInput {
  phoneCountryCode?: string;
  phoneNo?: string;
  password: string;
  otp: string;
}

@InputType()
export class serviceProviderOnboardingInput {
  @Field(() => GraphQLUpload, { nullable: true }) companyDocument?: FileUpload;
  personalIC?: string;
  providerType: ProviderTypeEnum;
  companyName?: string;
  companySSM?: string;
  fullName?: string;
  address?: string;
  phoneCountryCode?: string;
  serviceLocation?: string;
  phoneNo?: string;
  email?: string;
}

@InputType()
export class getMyJobInfoInput {
  limit: number;
  offset: number;
  filterJobStatus: jobStatusTypesEnum;
}

@InputType()
export class deleteServiceInput {
  productId: number;
}

@InputType()
export class ServiceProvidersUpdateMeInput {
  companyName?: string;
  companySSM?: string;
  personalIC?: string;
  providerType?: ProviderTypeEnum;
  fullName?: string;
  email?: string;
  jobTitle?: string;
  phoneCountryCode?: string;
  phoneNo?: string;
  fcmToken?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankReceiver?: string;
  serviceLocation?: string;
  address?: string;
}

@InputType()
export class ServiceProvidersAcceptJobInput {
  grandTotal?: number;
  @Field(() => ID) salesOrderId: number;
  jobStatus: SalesOrderMatchesTypes;
}

@InputType()
export class selectProductInput {
  id: number;
}

@InputType()
export class SelectProviderServiceInput {
  @Field(() => [selectProductInput]) selectProducts?: selectProductInput[];
  @Field(() => [selectProductInput]) unselectedProducts?: selectProductInput[];
}

@InputType()
export class UpdateServiceProvidersInput extends PartialType(CreateServiceProvidersInput) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class ServiceProvidersQuery extends QueryArgsType(ServiceProvidersDTO) {}
export const ServiceProvidersConnection = ServiceProvidersQuery.ConnectionType;

@ArgsType()
export class CustomFindOneServiceProvidersArgs extends FindOneArgsType(ServiceProvidersDTO) {}

@InputType()
export class CustomCreateOneServiceProvidersInput extends CreateOneInputType(
  'serviceProviders',
  CreateServiceProvidersInput,
) {}

@InputType()
export class CustomCreateManyServiceProvidersInput extends CreateManyInputType(
  'serviceProviders',
  CreateServiceProvidersInput,
) {}

@InputType()
export class CustomUpdateOneServiceProvidersInput extends UpdateOneInputType(
  ServiceProvidersDTO,
  UpdateServiceProvidersInput,
) {}

@InputType()
export class CustomDeleteOneServiceProvidersInput extends DeleteOneInputType(ServiceProvidersDTO) {}
