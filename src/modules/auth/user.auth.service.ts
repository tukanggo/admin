/* eslint-disable import/no-internal-modules */
import {
  Injectable,
  ForbiddenException,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import JwtConfig, * as JWT from 'src/configs/auth.config';
import { CustomerPointsEntity, CustomersEntity, CustomerVerificationsEntity } from 'src/entities';
import { comparePassword, hashPassword } from '@providers/bcrypt.service';
import { FindOneOptions, Repository } from 'typeorm';
import { AuthData, ExpireDate } from '@types';
import _ from 'lodash';
import {
  checkPhoneInput,
  ServiceProviderRegisterInput,
  SocialLoginOnboardingInput,
  UserEmailRegisterInput,
  UserRegisterInput,
} from './dto/auth.dto';
import { customAlphabet, nanoid } from 'nanoid';
import { generateOTP } from '@common/helpers/auth.helper';
import moment from 'moment';

interface AuthResponseData {
  data?: AuthData;
  accessToken?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  accessTokenExpiry?: number;
}

@Injectable()
export class UserAuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(CustomersEntity)
    private customerRepo: Repository<CustomersEntity>,
    @InjectRepository(CustomerVerificationsEntity)
    private phoneVerificationModel: Repository<CustomerVerificationsEntity>,
    @InjectRepository(CustomerPointsEntity)
    private customerPointRepo: Repository<CustomerPointsEntity>,
  ) {}

  // Facebook customerRepo Sign In
  async facebookSignIn(reqUser) {
    const facebookUser = {
      facebookId: reqUser.id,
      name: reqUser.name,
      picture: reqUser.picture.data.url,
      email: reqUser.email,
    };

    // Return error if no email on Facebook account
    if (!facebookUser.email)
      throw new BadRequestException('Please add Email to your Facebook account');

    // Check exist account with facebookId
    let user: any;
    user = await this.customerRepo.findOne({
      where: { facebookId: facebookUser.facebookId },
    });
    // if (!_.isEmpty(user) && user.phoneNo !== null) return this.getSignInToken(user);
    // return { isSetUpPhone: false };
    if (_.isEmpty(user)) {
      const checkMail = await this.customerRepo.findOne({ where: { email: facebookUser.email } });

      if (!_.isEmpty(checkMail)) {
        if (checkMail.facebookId === null) {
          user = await this.customerRepo.update(
            { id: checkMail.id },
            { facebookId: facebookUser.facebookId },
          );
        } else if (checkMail.facebookId !== facebookUser.facebookId) {
          throw new BadRequestException(`Email already exist`);
        }
      } else {
        const nanoid = customAlphabet(
          '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
          10,
        );
        const referralCode = nanoid();
        user = await this.customerRepo.save({
          fullName: reqUser.name,
          email: reqUser.email,
          facebookId: reqUser.id,
          referralCode,
        });
      }
    }

    const data = {
      id: user.id,
      name: user.fullName || null,
      email: user.email || null,
      phoneNumber: user.phoneNo,
      type: 'Customer',
    };

    const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
    const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

    return Promise.resolve({ data, accessToken, refreshToken });

    // Check exist accounts' email with facebook email (For linking)
    // return this.checkEmailExist(facebookUser);
  }

  // Google customerRepo Sign In
  async googleSignIn(reqUser) {
    const googleUser = {
      googleId: reqUser.id,
      name: reqUser.name,
      picture: reqUser.picture,
      email: reqUser.email,
    };

    // Check exist account with googleId
    let user: any;
    user = await this.customerRepo.findOne({
      where: { googleId: googleUser.googleId },
    });
    if (_.isEmpty(user)) {
      const checkMail = await this.customerRepo.findOne({ where: { email: googleUser.email } });
      if (!_.isEmpty(checkMail)) {
        if (checkMail.googleId === null) {
          user = await this.customerRepo.update(
            { id: checkMail.id },
            { googleId: googleUser.googleId },
          );
        } else {
          throw new BadRequestException(`Email already exist`);
        }
      } else {
        const nanoid = customAlphabet(
          '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
          10,
        );

        const referralCode = nanoid();
        user = await this.customerRepo.save({
          fullName: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.googleId,
          referralCode,
        });
      }
    }
    const data = {
      id: user.id,
      name: user.fullName || null,
      email: user.email || null,
      phoneNumber: user.phoneNo,
      type: 'Customer',
    };

    const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
    const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

    return Promise.resolve({ data, accessToken, refreshToken });
    // if (user?.phoneNo !== null) return this.getSignInToken(user);

    // Check exist accounts' email with google email (For linking)
    // return this.checkEmailExist(googleUser);
  }

  async appleSignIn(reqUser) {
    const appleUser = {
      appleId: reqUser.sub,
      email: reqUser.email,
    };
    let user;

    // Check exist account with appleId
    user = await this.customerRepo.findOne({
      where: { appleId: appleUser.appleId },
    });
    if (_.isEmpty(user)) {
      const checkMail = await this.customerRepo.findOne({ where: { email: appleUser.email } });
      if (!_.isEmpty(checkMail)) {
        if (checkMail.appleId === null) {
          user = await this.customerRepo.update(
            { id: checkMail.id },
            { appleId: appleUser.appleId },
          );
        } else {
          throw new BadRequestException(`Email already exist`);
        }
      } else {
        const nanoid = customAlphabet(
          '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
          10,
        );

        const referralCode = nanoid();
        user = await this.customerRepo.save({
          email: appleUser.email,
          appleId: appleUser.appleId,
          referralCode,
        });
      }
    }
    const data = {
      id: user.id,
      name: user.fullName || null,
      email: user.email || null,
      phoneNumber: user.phoneNo,
      type: 'Customer',
    };

    const accessToken = this.jwtService.sign(data, JWT.accessTokenConfig);
    const refreshToken = this.jwtService.sign(data, JWT.refreshTokenConfig);

    return Promise.resolve({ data, accessToken, refreshToken });
    // if (user?.phoneNo !== null) return this.getSignInToken(user);

    // Check exist accounts' email with apple email (For linking)
    // return this.checkEmailExist(appleUser);
  }

  // Get AccessToken and RefreshToken to SignIn
  private async getSignInToken(user: CustomersEntity, rememberMe?: boolean) {
    const refreshToken = await this.getRefreshToken(user, rememberMe);
    const accessToken = await this.getAccessToken(user);
    const accessTokenExpiry = await this.getAccessTokenExpiry(accessToken);
    user.refreshToken = refreshToken;
    await this.customerRepo.save(user);

    return { accessToken, refreshToken, accessTokenExpiry };
  }

  private getAuthData(user: CustomersEntity) {
    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNo,
      type: 'Customer',
    } as AuthData;
  }

  private getAccessToken(user: CustomersEntity) {
    return this.jwtService.sign(this.getAuthData(user), JWT.accessTokenConfig);
  }

  private getRefreshToken(user: CustomersEntity, rememberMe?: boolean) {
    JwtConfig.accessTokenConfig.expiresIn = rememberMe ? '20y' : '10y';
    return this.jwtService.sign(this.getAuthData(user), JWT.refreshTokenConfig);
  }

  private getAccessTokenExpiry(accessToken: string) {
    const decodedToken = this.jwtService.decode(accessToken) as ExpireDate;
    const accessTokenExpiry = decodedToken?.exp;
    return accessTokenExpiry;
  }

  async socialLoginOnboarding(
    id: any,
    platform: string,
    body: SocialLoginOnboardingInput,
    email: string,
  ) {
    const { name, phoneCountryCode, phoneNo, referralCode, otp, dob } = body;
    let where: FindOneOptions<CustomersEntity>['where'] = {};

    const phoneVerification = await this.phoneVerificationModel.findOne({
      where: {
        phoneCountryCode,
        phoneNo,
        verificationCode: otp,
        isValid: true,
      },
    });
    if (!_.isEmpty(phoneVerification)) {
      if (moment().toDate() > phoneVerification.validitity) {
        throw new ForbiddenException('Expired verification code.');
      }
    } else {
      throw new ForbiddenException('Expired verification code.');
    }
    const customer = await this.customerRepo.findOne({ where: { phoneCountryCode, phoneNo } });
    // let referralUser = null;
    if (!_.isEmpty(customer)) {
      throw new BadRequestException(`This Phone number had be used before`);
    }

    if (platform === 'google') {
      where = {
        googleId: id,
      };
    } else if (platform === 'apple') {
      where = {
        appleId: id,
      };
    } else if (platform === 'facebook') {
      where = {
        facebookId: id,
      };
    }
    // const where: FindOneOptions<CustomersEntity>['where'] = {
    //   ...(platform === 'google' ? { googleId: id } : {}),
    //   ...(platform === 'apple' ? { appleId: id } : {}),
    //   ...(platform === 'facebook' ? { facebookId: id } : {}),
    // };
    // if (_.isEmpty(customer)) {
    // const nanoid = customAlphabet(
    //   '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    //   8,
    // );
    // const referralCode = nanoid();
    const user = await this.customerRepo.findOne({ where });

    if (_.isEmpty(user)) {
      throw new NotFoundException(`User Account not found`);
    }
    const referralUser = body.referralCode
      ? await this.customerRepo.findOne({
          where: { referralCode },
        })
      : null;

    user.phoneCountryCode = phoneCountryCode;
    user.phoneNo = phoneNo;
    user.fullName = name;
    user.email = email;
    user.facebookId = platform === 'facebook' ? id : user?.facebookId;
    user.appleId = platform === 'apple' ? id : user?.appleId;
    user.googleId = platform === 'google' ? id : user?.googleId;
    user.referralId = referralUser ? referralUser.id : null;
    user.dob = body?.dob;

    await this.customerRepo.save(user);

    await this.customerPointRepo.save({
      customerId: user.id,
      point: 10,
      remarks: 'TukangGo welcome reward',
    });
    return this.getSignInToken(user);
    // }
    // else {
    //   if (platform === 'google') {
    //     if (!_.isEmpty(customer.googleId) && customer.googleId !== id) {
    //       throw new BadRequestException(`This Phone number had be used before`);
    //     }
    //   }
    //   if (platform === 'apple') {
    //     if (!_.isEmpty(customer.appleId) && customer.appleId !== id) {
    //       throw new BadRequestException(`This Phone number had be used before`);
    //     }
    //   }
    //   if (platform === 'facebook') {
    //     if (!_.isEmpty(customer.facebookId) && customer.facebookId !== id) {
    //       throw new BadRequestException(`This Phone number had be used before`);
    //     }
    //   }

    //   if (!customer.referralId) {
    //     if (!_.isEmpty(referralCode)) {
    //       const rUser = await this.customerRepo.findOne({
    //         where: { referralCode: body.referralCode },
    //       });

    //       if (!_.isEmpty(rUser)) {
    //         referralUser = rUser.id;
    //         await this.customerPointRepo.save({
    //           customerId: rUser.id,
    //           point: 10,
    //           remarks: 'Referral reward',
    //         });

    //         // await this.customerPointRepo.save({
    //         //   customerId: customer.id,
    //         //   point: 10,
    //         //   remarks: 'Referral reward',
    //         // });
    //       } else {
    //         throw new ForbiddenException('Invalid referral code');
    //       }
    //     }
    //   }
    //   customer.fullName = name;
    //   customer.phoneNo = phoneNo;
    //   customer.phoneCountryCode = phoneCountryCode;
    //   customer.referralId = referralUser;
    //   customer.googleId = platform === 'google' ? id : customer.googleId;
    //   customer.facebookId = platform === 'facebook' ? id : customer.facebookId;
    //   customer.appleId = platform === 'apple' ? id : customer.appleId;

    //   const user = await this.customerRepo.save(customer);

    //   return this.getSignInToken(user);
    // }
  }
}
