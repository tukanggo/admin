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
  BadRequestException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ApiBody, ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { MobileJwtAccessAuthGuard, MobileJwtRefreshAuthGuard } from '@guards/auth.guard';

import { AuthData, CurrentUser } from './auth.decorator';
import * as DTO from './dto/auth.dto';
import { AuthData as authData } from '@types';
import { CustomersEntity, ServiceProvidersEntity } from '@entities';
import { AnyFilesInterceptor, FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UserAuthService } from './user.auth.service';
import axios from 'axios';
import jwksClient from 'jwks-rsa';
import _ from 'lodash';

@ApiTags('Customer-Authentication')
@Controller()
export class UserAuthController {
  constructor(private authService: UserAuthService) {}

  @ApiOperation({ summary: 'Facebook SignIn' })
  @Post('auth/facebook-signIn')
  async facebookSignIn(@Body() body: DTO.facebookLoginInput) {
    const facebookUser = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: body.facebookToken,
        fields: 'id, name, picture, email',
      },
    });

    return await this.authService.facebookSignIn(facebookUser.data);
  }

  @ApiOperation({ summary: 'Google SignIn' })
  @Post('auth/google-signIn')
  async googleSignIn(@Body() body: DTO.googleLoginInput) {
    try {
      const googleUser = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?', {
        params: {
          alt: 'json',
          access_token: body.googleToken,
        },
      });
      return await this.authService.googleSignIn(googleUser.data);
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  }

  /** Apple Sign In */
  @ApiOperation({ summary: 'Apple SignIn' })
  @Post('auth/apple-signIn')
  async appleSignIn(@Body() body: DTO.appleLoginInput) {
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
    const kid = await jwt.decode(body.appleToken, { complete: true }).header?.kid;
    const applePublicKey = (await client.getSigningKey(kid)).getPublicKey();

    // Verify the body.appleToken's signature using Apple's public key
    const decodedToken = jwt.verify(body.appleToken, applePublicKey, {
      algorithms: ['RS256'],
    });

    if (!decodedToken) throw new BadRequestException('Invalid identity token');
    // verifyIdentityToken(body.appleToken);
    return await this.authService.appleSignIn(decodedToken);
  }

  @ApiOperation({ summary: 'Social Login Onboarding' })
  @Post('auth/social-login/on-boarding')
  async customerSocialLoginOnboarding(@Body() body: DTO.SocialLoginOnboardingInput) {
    try {
      let id;
      let email;
      let platform;

      if (!_.isEmpty(body.facebookToken)) {
        const facebookUser = await axios.get('https://graph.facebook.com/me', {
          params: {
            access_token: body.facebookToken,
            fields: 'id, name, picture, email',
          },
        });

        id = facebookUser.data.id;
        email = facebookUser.data.email;
        platform = 'facebook';
        // return await this.authService.socialLoginOnboarding(id, platform, body, email);
      }
      if (!_.isEmpty(body.googleToken)) {
        const googleUser = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?', {
          params: {
            alt: 'json',
            access_token: body.googleToken,
          },
        });

        id = googleUser.data.id;
        email = googleUser.data.email;
        platform = 'google';
        // return await this.authService.socialLoginOnboarding(id, platform, body, email);
      }
      if (!_.isEmpty(body.appleToken)) {
        const client = jwksClient({
          jwksUri: 'https://appleid.apple.com/auth/keys',
        });
        const kid = await jwt.decode(body.appleToken, { complete: true }).header?.kid;
        const applePublicKey = (await client.getSigningKey(kid)).getPublicKey();

        // Verify the body.appleToken's signature using Apple's public key
        const decodedToken = jwt.verify(body.appleToken, applePublicKey, {
          algorithms: ['RS256'],
        });

        if (!decodedToken) throw new BadRequestException('Invalid identity token');
        id = decodedToken.sub;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        email = decodedToken.email;
        platform = 'apple';
      }

      return await this.authService.socialLoginOnboarding(id, platform, body, email);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
