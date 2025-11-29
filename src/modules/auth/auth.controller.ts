/* eslint-disable import/no-internal-modules */
import {
  Controller,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import {
  MobileJwtAccessAuthGuard,
  MobileJwtRefreshAuthGuard,
  WebJwtAccessAuthGuard,
  WebJwtRefreshAuthGuard,
} from '@guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthData, CurrentUser } from './auth.decorator';
import * as DTO from './dto/auth.dto';
import { CustomersEntity } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthData as authData } from '@types';
import { comparePassword } from '@providers/bcrypt.service';
import { nanoid } from 'nanoid';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(CustomersEntity)
    private userRepository: Repository<CustomersEntity>,
  ) {}

  @ApiOperation({ summary: 'Admin Login' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.LoginDTO })
  @Post('auth/login')
  async login(
    @Body() body: DTO.LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DTO.LoginResponseDTO> {
    try {
      const data = await this.authService.login(body.email, body.password);
      res.status(200);
      return {
        message: 'Success',
        statusCode: 200,
        payload: {
          data: data.data,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpiry: data.accessTokenExpiry,
        },
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Admin Logout' })
  @ApiResponse({ status: 200, type: DTO.StandardResponse })
  @UseGuards(WebJwtAccessAuthGuard)
  @Post('auth/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @AuthData() admin: authData,
  ): Promise<DTO.StandardResponse> {
    await this.authService.logout(admin.id);
    req.logout((err) => {
      if (err) {
        throw new Error(err);
      }
    });
    res.status(200).clearCookie('accessToken');
    return { message: 'Logout successful', statusCode: 200 };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.RefreshTokenDTO })
  @Post('auth/refresh')
  @UseGuards(WebJwtRefreshAuthGuard)
  async revoke(
    @Res({ passthrough: true }) res: Response,
    @AuthData() admin: authData,
  ): Promise<DTO.RefreshTokenResponseDTO> {
    const data = await this.authService.revoke(admin.id);
    res.status(200);
    return {
      message: 'Success',
      statusCode: 200,
      payload: {
        data: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiry: data.accessTokenExpiry,
      },
    };
  }

  @ApiOperation({ summary: 'checking email admin registered' })
  @ApiBody({ type: DTO.checkEmailInput })
  @Post('auth/check-email')
  async checkAdminEmailExist(@Body() body: DTO.checkEmailInput) {
    return this.authService.checkAdminEmail(body);
  }

  @ApiOperation({ summary: 'Customer Registration' })
  @ApiBody({ type: DTO.UserRegisterInput })
  @Post('auth/user/register/email')
  async customerRegistration(@Body() body: DTO.UserEmailRegisterInput) {
    return this.authService.emailRegisterUser(body);
  }
  @ApiOperation({ summary: 'checking email registered' })
  @ApiBody({ type: DTO.UserRegisterInput })
  @Post('auth/user/check-email')
  async checkEmailExist(@Body() body: DTO.checkEmailInput) {
    return this.authService.checkEmail(body);
  }

  @ApiOperation({ summary: 'checking Phone registered' })
  @ApiBody({ type: DTO.UserRegisterInput })
  @Post('auth/user/check-phone')
  async checkPhoneExist(@Body() body: DTO.checkPhoneInput) {
    return this.authService.checkPhone(body);
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: DTO.UserEmailLoginInput })
  @Post('auth/user/login')
  async userLogin(@Body() body: DTO.UserEmailLoginInput): Promise<any> {
    try {
      let user: CustomersEntity;

      if (body.email) {
        user = await this.userRepository.findOne({
          where: { email: body.email },
        });

        if (!user) {
          throw new ForbiddenException('This email is not registered');
        }
        const isPasswordValid = await comparePassword(body.password, user.password);

        if (!isPasswordValid) {
          throw new ForbiddenException('Invalid password entered.');
        }
      }
      return this.authService.userEmailLogin(body.email, body.password);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  @ApiOperation({ summary: 'user otp Registration' })
  @ApiBody({ type: DTO.UserRegisterInput })
  @Post('auth/user/register/otp')
  async userOTPRegistration(@Body() body: DTO.UserRegisterInput) {
    return this.authService.phoneRegisterUser(body);
  }

  @ApiOperation({ summary: 'Phone Number Login' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.UserLoginInput })
  @Post('auth/user/phone-login')
  async OTPLogin(@Body() body: DTO.UserLoginInput): Promise<DTO.LoginResponseDTO> {
    try {
      return await this.authService.userPhoneLogin(
        body.phoneCountryCode,
        body.phoneNumber,
        body.password,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'OTP Verification' })
  @ApiBody({ type: DTO.VerifyPhoneNoInput })
  @Post('auth/verify-otp')
  verifyOTP(@Body() body: DTO.VerifyPhoneNoInput): Promise<any> {
    return this.authService.verifyPhoneNo(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh User Access Token' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.RefreshTokenDTO })
  @Post('auth/user/refresh')
  @UseGuards(MobileJwtRefreshAuthGuard)
  async revokeUser(
    @Body() body: DTO.RefreshTokenDTO,
    @Res({ passthrough: true }) res: Response,
    @AuthData() user: authData,
  ): Promise<any> {
    const { refreshToken } = body;
    res.status(200);
    return await this.authService.revokeUser(user.id, refreshToken);
  }

  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({ status: 200, type: DTO.StandardResponse })
  @ApiBody({ type: DTO.LogoutDTO })
  @Post('auth/user/logout')
  async userLogout(
    @Body() body: DTO.LogoutDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DTO.StandardResponse> {
    if (body.fcmToken) await this.authService.userLogout(body.fcmToken);
    return { message: 'Logout successful', statusCode: 200 };
  }

  @ApiOperation({ summary: 'request reset password' })
  @ApiBody({ type: DTO.checkPhoneInput })
  @Post('auth/request-reset-password')
  async requestResetPassword(@Body() body: DTO.checkPhoneInput) {
    return this.authService.requestResetPassword(body.phoneCountryCode, body.phoneNumber);
  }

  @ApiOperation({ summary: 'reset password' })
  @ApiBody({ type: DTO.resetPasswordInput })
  @Post('auth/reset-password')
  async resetPassword(@Body() body: DTO.resetPasswordInput) {
    return this.authService.resetPassword(body.resetToken, body.newPassword);
  }

  @ApiBody({ type: DTO.OTPResetPasswordInput })
  @Post('auth/reset-password-otp')
  async otpResetPassword(@Body() body: DTO.OTPResetPasswordInput) {
    return await this.authService.resetPasswordOTP(
      body.otp,
      body.phoneCountryCode,
      body.phoneNumber,
      body.newPassword,
    );
  }

  @ApiOperation({ summary: 'checking referral code' })
  @ApiBody({ type: DTO.checkReferralCodeInput })
  @Post('auth/user/check-referral-code')
  async checkReferralCodeExist(@Body() body: DTO.checkReferralCodeInput) {
    return this.authService.checkReferralCode(body);
  }

  @ApiOperation({ summary: 'change Password' })
  @Post('auth/user/change-pass')
  @UseGuards(MobileJwtAccessAuthGuard)
  async changePassword(
    @CurrentUser() user: CustomersEntity,
    @Body() body: DTO.UserChangePassInput,
  ) {
    return await this.authService.changePassword(user.id, body.password, body.newPassword);
  }

  @ApiOperation({ summary: 'request OTP' })
  @ApiBody({ type: DTO.UserLoginInput })
  @Post('auth/otp')
  async requestOTP(@Body() body: DTO.UserLoginInput) {
    return this.authService.requestOTP(body.phoneCountryCode, body.phoneNumber);
  }
}
