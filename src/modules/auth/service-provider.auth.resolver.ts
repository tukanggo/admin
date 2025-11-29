/* eslint-disable import/no-internal-modules */
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminsEntity,
  CustomersEntity,
  CustomerVerificationsEntity,
  ServiceProvidersDTO,
  ServiceProvidersEntity,
} from 'src/entities';
import { GqlAuthUser } from './auth.decorator';
import * as DTO from './dto/auth-gql.dto';
import { comparePassword, hashPassword } from '@providers/bcrypt.service';
import { AuthData } from '@types';
import { Repository } from 'typeorm';
import {
  CreateServiceProvidersInput,
  registerServiceProvidersInput,
  serviceProviderOnboardingInput,
} from '@modules/service-providers/service-providers.input';
import JwtConfig from '@configs/auth.config';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { FileUpload } from 'graphql-upload';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import moment from 'moment';
import { authData } from './dto/auth.dto';
@ObjectType('RegisterServiceProvider')
export class registerServiceProvidersDTO {
  @Field() accessToken: string;
  @Field() refreshToken: string;
}

@Resolver(() => ServiceProvidersDTO)
export class ServiceProviderAuthResolver {
  constructor(
    @InjectRepository(ServiceProvidersEntity)
    private serviceProvider: Repository<ServiceProvidersEntity>,
    private jwtService: JwtService,
    @InjectRepository(CustomerVerificationsEntity)
    private phoneVerificationModel: Repository<CustomerVerificationsEntity>,
  ) {}

  @Mutation(() => registerServiceProvidersDTO)
  async registerServiceProvider(@Args('input') input: registerServiceProvidersInput) {
    try {
      const userPhone = await this.phoneVerificationModel.findOneOrFail({
        where: { phoneCountryCode: input.phoneCountryCode, phoneNo: input.phoneNo },
        order: { id: 'DESC' },
      });
      if (userPhone) {
        if (userPhone.isValid == true) {
          if (input.otp !== userPhone.verificationCode) {
            throw new ForbiddenException('Incorrect verification code.');
          } else {
            if (moment().toDate() > userPhone.validitity) {
              throw new ForbiddenException('expiry verification code.');
            } else {
              const serviceProvider = await this.serviceProvider.findOne({
                where: {
                  phoneCountryCode: input.phoneCountryCode,
                  phoneNo: input.phoneNo,
                },
              });

              if (serviceProvider) {
                throw new ForbiddenException('This phone number is already in use');
              } else {
                const password = hashPassword(input.password);

                const serviceProvider = await this.serviceProvider.save({
                  phoneNo: input.phoneNo,
                  phoneCountryCode: input.phoneCountryCode,
                  password,
                });

                const data = {
                  id: serviceProvider.id,
                  name: serviceProvider.fullName || null,
                  email: serviceProvider.email || null,
                  phoneNo: serviceProvider.phoneNo,
                  type: 'SERVICE_PROVIDER',
                };

                const accessToken = this.jwtService.sign(
                  data,
                  JwtConfig.serviceProviderAccessTokenConfig,
                );
                const refreshToken = this.jwtService.sign(
                  data,
                  JwtConfig.serviceProviderRefreshTokenConfig,
                );

                userPhone.isValid = false;
                this.phoneVerificationModel.save(userPhone);

                return { accessToken, refreshToken };
              }
            }
          }
        } else {
          throw new ForbiddenException('Invalid verification code.');
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
