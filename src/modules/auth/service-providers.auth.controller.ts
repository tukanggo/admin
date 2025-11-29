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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import {
  ServiceProviderJwtAuthGuard,
  ServiceProviderJwtRefreshAuthGuard,
} from '@guards/auth.guard';
import { ServiceProviderAuthService } from './service-providers.auth.service';
import { AuthData, CurrentUser } from './auth.decorator';
import * as DTO from './dto/auth.dto';
import { AuthData as authData } from '@types';
import { CustomersEntity, ServiceProvidersEntity } from '@entities';
import { AnyFilesInterceptor, FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Service-Provider-Authentication')
@Controller()
export class ServicePartnerAuthController {
  constructor(private authService: ServiceProviderAuthService) { }
  @ApiOperation({ summary: 'service provider Login' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.LoginDTO })
  @Post('auth/service-provider/login')
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

  @ApiOperation({ summary: 'service provider Logout' })
  @ApiResponse({ status: 200, type: DTO.StandardResponse })
  @UseGuards(ServiceProviderJwtRefreshAuthGuard)
  @Post('auth/service-provider/logout')
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
  @ApiOperation({ summary: 'service provider Refresh Access Token' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.RefreshTokenDTO })
  @Post('auth/service-provider/refresh')
  @UseGuards(ServiceProviderJwtRefreshAuthGuard)
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

  @ApiOperation({ summary: 'Phone Number Login' })
  @ApiResponse({ status: 200, type: DTO.LoginResponseDTO })
  @ApiBody({ type: DTO.UserLoginInput })
  @Post('auth/service-provider/phone-login')
  async OTPLogin(@Body() body: DTO.UserLoginInput): Promise<DTO.LoginResponseDTO> {
    try {
      return await this.authService.serviceProviderPhoneLogin(
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
  @Post('auth/service-provider/verify-otp')
  verifyOTP(@Body() body: DTO.VerifyPhoneNoInput): Promise<any> {
    return this.authService.verifyPhoneNo(body);
  }

  @ApiOperation({ summary: 'OTP Verification' })
  @ApiBody({ type: DTO.checkOTPInput })
  @Post('auth/service-provider/check-reset-password-otp')
  verifyResetPasswordOTP(@Body() body: DTO.checkOTPInput): Promise<any> {
    return this.authService.checkResetPasswordOTP(body);
  }

  @ApiOperation({ summary: 'checking Phone registered' })
  @ApiBody({ type: DTO.checkPhoneInput })
  @Post('auth/service-provider/check-phone')
  async checkPhoneExist(@Body() body: DTO.checkPhoneInput) {
    return await this.authService.checkPhone(body);
  }

  @ApiOperation({ summary: 'request reset password' })
  @ApiBody({ type: DTO.checkPhoneInput })
  @Post('auth/service-provider/request-reset-password')
  async requestResetPassword(@Body() body: DTO.checkPhoneInput) {
    return await this.authService.requestResetPassword(body.phoneCountryCode, body.phoneNumber);
  }

  @ApiOperation({ summary: 'otp reset password' })
  @ApiBody({ type: DTO.serviceProviderOTPResetPasswordInput })
  @Post('auth/service-provider/reset-password-otp')
  async otpResetPassword(@Body() body: DTO.serviceProviderOTPResetPasswordInput) {
    return await this.authService.resetPasswordOTP(
      body.otp,
      body.phoneCountryCode,
      body.phoneNumber,
      body.newPassword,
    );
  }

  @ApiOperation({ summary: 'change Password' })
  @Post('auth/service-provider/change-pass')
  @UseGuards(ServiceProviderJwtAuthGuard)
  async changePassword(
    @CurrentUser() user: ServiceProvidersEntity,
    @Body() body: DTO.ServiceProviderChangePassInput,
  ) {
    return await this.authService.changePassword(user.id, body.newPassword);
  }
}
