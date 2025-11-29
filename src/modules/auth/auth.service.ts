/* eslint-disable import/no-internal-modules */
import { Injectable, ForbiddenException, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  checkEmailInput,
  checkPhoneInput,
  checkReferralCodeInput,
  UserEmailRegisterInput,
  UserRegisterInput,
  VerifyPhoneNoInput,
} from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import JwtConfig, * as JWT from 'src/configs/auth.config';
import {
  AdminsEntity,
  CustomerPointsEntity,
  CustomersEntity,
  CustomerVerificationsEntity,
} from 'src/entities';
import { comparePassword, hashPassword } from '@providers/bcrypt.service';
import { generateOTP } from 'src/common/helpers/auth.helper';
import moment from 'moment';
// import _ from 'lodash';
// import { sendSMS } from 'src/services/oneway-sms.service';
import { Repository } from 'typeorm';
import { AuthData } from '@types';
import _ from 'lodash';
import { customAlphabet, nanoid } from 'nanoid';
import { sendSMS } from '@providers/oneway-sms.service';

interface AuthResponseData {
  data?: AuthData;
  accessToken?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  accessTokenExpiry?: number;
}

const verificationCode = '123456';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminsEntity) private Admin: Repository<AdminsEntity>,
    private jwtService: JwtService,
    @InjectRepository(CustomersEntity) private userModel: Repository<CustomersEntity>,
    @InjectRepository(CustomerVerificationsEntity)
    private phoneVerificationModel: Repository<CustomerVerificationsEntity>,
    @InjectRepository(CustomerPointsEntity)
    private customerPointRepo: Repository<CustomerPointsEntity>,
  ) {}

  async login(email: string, password: string): Promise<AuthResponseData> {
    try {
      const admin = await this.Admin.findOne({ where: { email } });
      if (!admin) throw new Error('Account not found');
      const valid = await comparePassword(password, admin.password);
      if (!valid) throw new Error('Email or password is incorrect');

      const data: AuthData = {
        id: admin.id,
        name: null,
        email: admin.email,
        phoneNumber: null,
        type: 'Admin',
      };
      const accessToken = this.jwtService.sign(data, JwtConfig.adminAccessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JwtConfig.adminRefreshTokenConfig);

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

  async userOTPLogin(phoneCountryCode: string, phoneNumber: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({
        where: { phoneCountryCode, phoneNo: phoneNumber },
      });
      if (!user) throw new Error('Account not found');

      const phoneNo = phoneCountryCode + phoneNumber;

      const verificationCode = generateOTP();

      this.phoneVerificationModel.save({
        phoneNo,
        verificationCode,
        validitity: moment().add(15, 'm').toDate(),
      });
      const message = 'TUKANG-GO: Your verify code is ' + verificationCode;

      sendSMS({ to: phoneNo, message });

      return Promise.resolve({ message: 'request OTP Successfully  ' });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async userEmailLogin(email: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ where: { email } });
      if (!user) throw new Error('Account not found');
      const valid = await comparePassword(password, user.password);
      if (!valid) throw new Error('Email or password is incorrect');
      if (!user.isActive) throw new BadRequestException(`This account has be suspended`);

      const data: AuthData = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNo,
        type: 'Customer',
      };
      const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

      return Promise.resolve({ data, accessToken, refreshToken });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async userPhoneLogin(phoneCountryCode: string, phoneNo: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ where: { phoneCountryCode, phoneNo } });
      if (!user) throw new Error('Account not found');
      const valid = await comparePassword(password, user.password);
      if (!valid) throw new Error('phone or password is incorrect');
      if (!user.isActive) throw new BadRequestException(`This account has be suspended`);

      const data: AuthData = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNo,
        type: 'Customer',
      };
      const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

      return Promise.resolve({ data, accessToken, refreshToken });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async revoke(id: number): Promise<AuthResponseData> {
    try {
      const admin = await this.Admin.findOne({ where: { id } });
      if (!admin) throw new Error('Account not found');
      const data: AuthData = {
        id: admin.id,
        name: null,
        email: admin.email,
        phoneNumber: null,
        type: 'Admin',
      };
      const accessToken = this.jwtService.sign(data, JwtConfig.adminAccessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JwtConfig.adminRefreshTokenConfig);

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

  async revokeUser(id: number, rToken: string): Promise<AuthResponseData> {
    try {
      const dateNow = new Date();
      const user = await this.userModel.findOne({ where: { id } });
      if (!user) throw new Error('Account not found');
      if (!user.isActive) throw new BadRequestException(`This account has be suspended`);
      const check = this.jwtService.verify(rToken, {
        secret: JWT.refreshTokenConfig.secret,
      });
      if (check.phoneNumber !== user.phoneNo) throw new Error('Invalid token');
      if (check.exp < dateNow.getDate() / 1000) {
        throw new ForbiddenException('Token expired');
      }
      const data: AuthData = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNo,
        type: 'Customer',
      };
      const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
      const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

      return Promise.resolve({ data, accessToken, refreshToken });
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          message: e.name === 'TokenExpiredError' ? 'Token expired' : e.message,
        },
        e.status,
      );
    }
  }

  async logout(id: number): Promise<void> {
    try {
      const admin = await this.Admin.findOne({ where: { id } });
      // if (admin) await admin.update({ refreshToken: null });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async userLogout(fcmToken: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ where: { fcmToken } });
      if (user) {
        user.fcmToken = null;
        await this.userModel.save(user);
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  emailRegisterUser(input: UserEmailRegisterInput) {
    return new Promise(async (resolve, reject) => {
      try {
        if (input.email) {
          const user = await this.userModel.findOne({
            where: { email: input.email },
          });
          if (user) {
            throw new ForbiddenException('This email is already in use');
          }

          if (input.password !== input.confirmPassword) {
            throw new ForbiddenException('Password not same');
          } else {
            const nanoid = customAlphabet(
              '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
              10,
            );
            const referralCode = nanoid();
            const referralUser = input.referralCode
              ? await this.userModel.findOne({
                  where: { referralCode: input.referralCode },
                })
              : null;

            const password = hashPassword(input.password);
            await this.userModel.save({
              email: input.email,
              password,
              referralId: referralUser ? referralUser.id : null,
              referralCode,
            });
            return resolve({ message: 'create account success' });
          }
        }
      } catch (e) {
        return reject(e);
      }
    });
  }

  checkReferralCode(input: checkReferralCodeInput) {
    return new Promise(async (resolve, reject) => {
      try {
        if (input.referralCode) {
          const user = await this.userModel.findOne({
            where: { referralCode: input.referralCode },
          });
          if (user) {
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

  requestOTP(phoneCountryCode: string, phoneNumber: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (phoneNumber) {
          const phoneNo = phoneCountryCode + phoneNumber;

          const verificationCode = generateOTP();

          this.phoneVerificationModel.save({
            phoneCountryCode,
            phoneNo: phoneNumber,
            verificationCode,
            validitity: moment().add(15, 'm').toDate(),
          });

          const message = 'TUKANG-GO: Your verify code is ' + verificationCode;

          sendSMS({ to: phoneNo, message });
          return resolve({ OTP: verificationCode });
        }
      } catch (e) {
        return reject(e);
      }
    });
  }

  phoneRegisterUser(input: UserRegisterInput) {
    return new Promise(async (resolve, reject) => {
      try {
        const userPhone = await this.phoneVerificationModel.findOneOrFail({
          where: { phoneCountryCode: input.phoneCountryCode, phoneNo: input.phoneNumber },
          order: { id: 'DESC' },
        });
        if (userPhone) {
          if (userPhone.isValid == true) {
            if (input.otp !== userPhone.verificationCode) {
              throw new ForbiddenException('Incorrect verification code.');
            } else {
              const user = await this.userModel.findOne({
                where: {
                  phoneCountryCode: input.phoneCountryCode,
                  phoneNo: input.phoneNumber,
                },
              });

              if (user) {
                throw new ForbiddenException('This phone number is already in use');
              } else {
                const nanoid = customAlphabet(
                  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                  8,
                );
                const referralCode = nanoid();
                const referralUser = input.referralCode
                  ? await this.userModel.findOne({
                      where: { referralCode: input.referralCode },
                    })
                  : null;
                const password = hashPassword(input.password);

                const user = await this.userModel.save({
                  phoneNo: input.phoneNumber,
                  phoneCountryCode: input.phoneCountryCode,
                  fullName: input.username,
                  password,
                  referralId: referralUser ? referralUser.id : null,
                  referralCode,
                  isPhoneVerified: true,
                  email: input.email || null,
                });

                if (!_.isEmpty(referralUser)) {
                  await this.customerPointRepo.save({
                    customerId: referralUser.id,
                    referredUserId: user.id,
                    point: 10,
                    remarks: `Referral reward from ${input.username}`,
                  });
                  // await this.customerPointRepo.save({
                  //   customerId: user.id,
                  //   point: 10,
                  //   remarks: 'Referral reward',
                  // });
                }
                await this.customerPointRepo.save({
                  customerId: user.id,
                  point: 10,
                  remarks: 'TukangGo welcome reward',
                });
                const data = {
                  id: user.id,
                  name: user.fullName || null,
                  email: user.email || null,
                  phoneNumber: user.phoneNo,
                  type: 'Customer',
                };

                const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
                const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

                return resolve({ data, accessToken, refreshToken });
                // return resolve({ message: 'success' });
              }
            }
          } else {
            throw new ForbiddenException('Invalid verification code.');
          }
        } else {
          throw new ForbiddenException('Phone number is not valid.');
        }
      } catch (e) {
        return reject(e);
      }
    });
  }

  async verifyPhoneNo(input: VerifyPhoneNoInput): Promise<AuthResponseData> {
    try {
      const user = await this.userModel.findOne({ where: { phoneNo: input.phoneNumber } });

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
                type: 'Customer',
              };

              userPhone.isValid = false;
              await this.phoneVerificationModel.save(userPhone);
              const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
              const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

              return Promise.resolve({ data, accessToken, refreshToken });
            } else {
              userPhone.isValid = false;
              await this.phoneVerificationModel.save(userPhone);
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

  checkEmail(input: checkEmailInput) {
    return new Promise(async (resolve, reject) => {
      try {
        if (input.email) {
          const user = await this.userModel.findOne({
            where: { email: input.email },
          });
          if (user) {
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

  checkAdminEmail(input: checkEmailInput) {
    return new Promise(async (resolve, reject) => {
      try {
        if (input.email) {
          const admin = await this.Admin.findOne({
            where: { email: input.email },
          });
          if (!_.isEmpty(admin)) {
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

  checkPhone(input: checkPhoneInput) {
    return new Promise(async (resolve, reject) => {
      try {
        if (input.phoneNumber) {
          const user = await this.userModel.findOne({
            where: { phoneCountryCode: input.phoneCountryCode, phoneNo: input.phoneNumber },
          });
          if (!_.isEmpty(user)) {
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

  requestResetPassword(phoneCountryCode: string, phoneNo: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.findOne({
          where: { phoneCountryCode, phoneNo },
        });
        // const resetToken = nanoid(10);
        const resetToken = generateOTP();
        if (user) {
          user.resetPasswordToken = resetToken;

          // await this.userModel.save(user);

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

          return resolve({ message: 'request reset password success' });
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
        const user = await this.userModel.findOne({ where: { resetPasswordToken: resetToken } });
        if (!user) throw new Error('Account not found');
        user.password = hashPassword(newPassword);
        user.resetPasswordToken = null;
        await this.userModel.save(user);
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
        const user = await this.userModel.findOne({
          where: { phoneCountryCode, phoneNo },
        });

        if (verifyOTP.validitity < moment().toDate()) {
          verifyOTP.isValid = false;
          await this.phoneVerificationModel.save(verifyOTP);
          throw new ForbiddenException('Unavailability verification code.');
        }
        if (!user) throw new Error('Account not found');
        user.password = hashPassword(newPassword);
        await this.userModel.save(user);
        verifyOTP.isValid = false;
        await this.phoneVerificationModel.save(verifyOTP);
        return resolve({ message: ' reset password successfully' });
      } catch (e) {
        return reject(e);
      }
    });
  }

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findOne({ where: { id: id } });
    if (!user) throw new ForbiddenException('user not found.');

    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) throw new ForbiddenException('Old Password is incorrect');

    user.password = hashPassword(newPassword);
    await this.userModel.save(user);
    return Promise.resolve({ message: 'Password changed successfully' });
  }
}
