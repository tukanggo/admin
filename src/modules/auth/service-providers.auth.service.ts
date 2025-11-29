/* eslint-disable import/no-internal-modules */
import { Injectable, ForbiddenException, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import JwtConfig, * as JWT from 'src/configs/auth.config';
import { CustomerVerificationsEntity, ServiceProvidersEntity } from 'src/entities';
import { comparePassword, hashPassword } from '@providers/bcrypt.service';
import { Repository } from 'typeorm';
import { AuthData } from '@types';
import _ from 'lodash';
import {
  checkOTPInput,
  checkPhoneInput,
  ServiceProviderRegisterInput,
  UserEmailRegisterInput,
  UserRegisterInput,
  VerifyPhoneNoInput,
} from './dto/auth.dto';
import { nanoid } from 'nanoid';
import { generateOTP } from '@common/helpers/auth.helper';
import moment from 'moment';
import { sendSMS } from '@providers/oneway-sms.service';

interface AuthResponseData {
  data?: AuthData;
  accessToken?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  accessTokenExpiry?: number;
}

@Injectable()
export class ServiceProviderAuthService {
  constructor(
    @InjectRepository(ServiceProvidersEntity)
    private serviceProvider: Repository<ServiceProvidersEntity>,
    private jwtService: JwtService,
    @InjectRepository(CustomerVerificationsEntity)
    private phoneVerificationModel: Repository<CustomerVerificationsEntity>,
  ) { }

  async login(email: string, password: string): Promise<AuthResponseData> {
    try {
      const serviceProvider = await this.serviceProvider.findOne({ where: { email } });
      if (!serviceProvider) throw new Error('Account not found');
      if (serviceProvider.isBanned == true) {
        throw new BadRequestException('this account has been banned');
      }

      const valid = await comparePassword(password, serviceProvider.password);
      if (!valid) throw new Error('Email or password is incorrect');

      const data: AuthData = {
        id: serviceProvider.id,
        name: serviceProvider.fullName,
        email: serviceProvider.email,
        phoneNumber: serviceProvider.phoneNo,
        type: 'SERVICE_PROVIDER',
      };
      const accessToken = this.jwtService.sign(data, JwtConfig.serviceProviderAccessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JwtConfig.serviceProviderRefreshTokenConfig);
      const decoded: any = this.jwtService.decode(accessToken, { complete: true });

      return Promise.resolve({
        data,
        accessToken,
        refreshToken,
        accessTokenExpiry: Number(_.get(decoded, 'payload.exp', null) ?? 0),
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async revoke(id: number): Promise<AuthResponseData> {
    try {
      const serviceProvider = await this.serviceProvider.findOne({ where: { id } });
      if (!serviceProvider) throw new Error('Account not found');

      if (serviceProvider.isBanned == true) {
        throw new BadRequestException('this account has been banned');
      }

      const data: AuthData = {
        id: serviceProvider.id,
        name: serviceProvider.fullName,
        email: serviceProvider.email,
        phoneNumber: serviceProvider.phoneNo,
        type: 'SERVICE_PROVIDER',
      };
      const accessToken = this.jwtService.sign(data, JwtConfig.serviceProviderAccessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JwtConfig.serviceProviderRefreshTokenConfig);
      const decoded: any = this.jwtService.decode(accessToken, { complete: true });

      return Promise.resolve({
        data,
        accessToken,
        refreshToken,
        accessTokenExpiry: Number(_.get(decoded, 'payload.exp', null) ?? 0),
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async logout(id: number): Promise<void> {
    try {
      const serviceProvider = await this.serviceProvider.findOne({ where: { id } });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async verifyPhoneNo(input: VerifyPhoneNoInput): Promise<AuthResponseData> {
    try {
      const user = await this.serviceProvider.findOne({ where: { phoneNo: input.phoneNumber } });

      const phoneNo = input.phoneCountryCode + input.phoneNumber;
      const userPhone = await this.phoneVerificationModel.findOne({
        where: [{ phoneCountryCode: input.phoneCountryCode, phoneNo: input.phoneNumber }],
        order: { id: 'DESC' },
      });

      let data: AuthData;

      if (userPhone) {
        if (userPhone.isValid == true) {
          if (input.code !== userPhone.verificationCode) {
            throw new ForbiddenException('Incorrect verification code.');
          } else {
            if (userPhone.validitity < moment().toDate()) {
              throw new ForbiddenException('Unavailability verification code.');
            }

            if (user) {
              data = {
                id: user ? user.id : null,
                name: user.fullName || null,
                email: user.email || null,
                phoneNumber: user.phoneNo,
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

              return Promise.resolve({ data, accessToken, refreshToken });
            } else {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return Promise.resolve({ message: 'success' });
            }
          }
        } else {
          throw new ForbiddenException('Invalid verification code.');
        }
      } else {
        throw new ForbiddenException('Unavailable captcha request.');
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async serviceProviderPhoneLogin(
    phoneCountryCode: string,
    phoneNo: string,
    password: string,
  ): Promise<any> {
    try {
      const serviceProvider = await this.serviceProvider.findOne({
        where: { phoneCountryCode, phoneNo },
      });
      if (!serviceProvider) throw new Error('Account not found');
      const valid = await comparePassword(password, serviceProvider.password);
      if (!valid) throw new Error('phone or password is incorrect');

      const data: AuthData = {
        id: serviceProvider.id,
        name: serviceProvider.fullName,
        email: serviceProvider.email,
        phoneNumber: serviceProvider.phoneNo,
        type: 'SERVICE_PROVIDER',
      };
      const accessToken = this.jwtService.sign(data, JwtConfig.serviceProviderAccessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JwtConfig.serviceProviderRefreshTokenConfig);

      return Promise.resolve({ data, accessToken, refreshToken });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  checkPhone(input: checkPhoneInput) {
    return new Promise(async (resolve, reject) => {
      try {
        if (input.phoneNumber) {
          const serviceProvider = await this.serviceProvider.findOne({
            where: { resetPasswordToken: input.phoneNumber },
          });
          if (!_.isEmpty(serviceProvider)) {
            return resolve({ isExist: true });
          } else {
            return resolve({ isExist: false });
          }
        }
      } catch (e) {
        return reject(e);
      }
    });
  }

  checkResetPasswordOTP(input: checkOTPInput) {
    return new Promise(async (resolve, reject) => {
      try {
        const spVerification = await this.phoneVerificationModel.findOne({
          where: {
            phoneCountryCode: input.phoneCountryCode,
            phoneNo: input.phoneNumber,
            verificationCode: input.resetPasswordOTP,
            isValid: true,
          },
        });
        if (!_.isEmpty(spVerification)) {
          if (moment().toDate() > spVerification.validitity) {
            throw new ForbiddenException('Expired verification code.');
          } else {
            return resolve({ message: 'Success', isValidOTP: true });
          }
        } else {
          throw new ForbiddenException('Expired verification code.');
        }
      } catch (e) {
        return reject(e);
      }
    });
  }

  requestResetPassword(phoneCountryCode: string, phoneNo: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.serviceProvider.findOne({
          where: { phoneCountryCode, phoneNo },
        });
        const resetToken = generateOTP();

        if (user) {
          this.phoneVerificationModel.save({
            phoneCountryCode,
            phoneNo,
            verificationCode: resetToken,
            validitity: moment().add(15, 'm').toDate(),
          });
          sendSMS({
            to: phoneCountryCode + phoneNo,
            message: `TUKANG-GO: Your verify code is ${resetToken}`,
          });
          return resolve({ OTP: resetToken });
        } else {
          throw new ForbiddenException('user not found');
        }
      } catch (e) {
        return reject(e);
      }
    });
  }

  async resetPassword(resetToken: string, newPassword: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const serviceProvider = await this.serviceProvider.findOne({
          where: { resetPasswordToken: resetToken },
        });
        if (!serviceProvider) throw new Error('Account not found');
        serviceProvider.password = hashPassword(newPassword);
        serviceProvider.resetPasswordToken = null;
        await this.serviceProvider.save(serviceProvider);
        return resolve({ message: ' reset password successfully' });
      } catch (e) {
        return reject(e);
      }
    });
  }

  async resetPasswordOTP(
    otp: string,
    phoneCountryCode: string,
    phoneNo: string,
    newPassword: string,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const verifyOTP = await this.phoneVerificationModel.findOne({
          where: { phoneCountryCode, phoneNo, verificationCode: otp, isValid: true },
        });

        if (_.isEmpty(verifyOTP)) throw new Error(`Invalid OTP`);
        const serviceProvider = await this.serviceProvider.findOne({
          where: { phoneCountryCode, phoneNo },
        });
        if (verifyOTP.validitity < moment().toDate()) {
          verifyOTP.isValid = false;
          await this.phoneVerificationModel.save(verifyOTP);
          throw new ForbiddenException('Unavailability verification code.');
        }
        if (!serviceProvider) throw new Error('Account not found');

        serviceProvider.password = hashPassword(newPassword);
        await this.serviceProvider.save(serviceProvider);
        verifyOTP.isValid = false;
        await this.phoneVerificationModel.save(verifyOTP);
        return resolve({ message: ' reset password successfully' });
      } catch (e) {
        return reject(e);
      }
    });
  }

  async changePassword(id: number, newPassword: string) {
    const serviceProvider = await this.serviceProvider.findOne({ where: { id: id } });
    if (!serviceProvider) throw new ForbiddenException('user not found.');

    // const valid = await comparePassword(oldPassword, serviceProvider.password);
    // if (!valid) throw new ForbiddenException('Old Password is incorrect');

    serviceProvider.password = hashPassword(newPassword);
    await this.serviceProvider.save(serviceProvider);
    return Promise.resolve({ message: 'Password changed successfully' });
  }
}
