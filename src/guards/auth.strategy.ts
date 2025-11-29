import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import JwtConfig, * as JWT from 'src/configs/auth.config';
import Jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import _ from 'lodash';
import { AuthData } from '@types';
import { ServiceProvidersEntity } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

dotenv.config();

// const getWebCookie = (req: Request) => req.cookies[process.env.WEB_REFRESH_COOKIE_NAME];
// const WebCookieExtractor = (req: Request): string => getWebCookie(req);

const getMobileCookie = (req: Request) => req.cookies[process.env.MOBILE_REFRESH_COOKIE_NAME];
const MobileCookieExtractor = (req: Request): string => getMobileCookie(req);

@Injectable()
export class WebAccessAuthStrategy extends PassportStrategy(JWTStrategy, 'web-jwt-access') {
  constructor() {
    super({
      secretOrKey: JwtConfig.adminAccessTokenConfig.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }
  async validate(_req: Request, payload: AuthData) {
    if (!payload) throw new UnauthorizedException();
    if (payload.type !== 'Admin') throw new Error('Unauthorized');
    return payload;
  }
}

@Injectable()
export class WebRefreshAuthStrategy extends PassportStrategy(JWTStrategy, 'web-jwt-refresh') {
  constructor() {
    super({
      secretOrKey: JwtConfig.adminRefreshTokenConfig.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return _.get(req, 'body.refreshToken');
        },
      ]),
    });
  }
  async validate(_req: Request, payload: AuthData) {
    const validToken = Jwt.verify(_req.body.refreshToken, JwtConfig.adminRefreshTokenConfig.secret);
    if (!validToken) throw new UnauthorizedException();
    return payload;
  }
}

@Injectable()
export class MobileAccessAuthStrategy extends PassportStrategy(JWTStrategy, 'mobile-jwt-access') {
  constructor() {
    super({
      secretOrKey: JWT.accessTokenConfig.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }
  async validate(_req: any, payload: any) {
    if (!payload) throw new Error('Unauthorized');
    if (payload.type !== 'Customer') throw new Error('Unauthorized');
    return payload;
  }
}

@Injectable()
export class MobileRefreshAuthStrategy extends PassportStrategy(JWTStrategy, 'mobile-jwt-refresh') {
  constructor() {
    super({
      secretOrKey: JWT.refreshTokenConfig.secret,
      ignoreExpiration: true,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return _.get(req, 'body.refreshToken');
        },
      ]),
    });
  }
  async validate(_req: Request, payload: AuthData) {
    if (!payload) throw new Error('Unauthorized');
    if (payload.type !== 'Customer') throw new Error('Unauthorized');
    return payload;
  }
}

@Injectable()
export class ServiceProviderJwtAuthStrategy extends PassportStrategy(
  JWTStrategy,
  'service-partner-jwt',
) {
  constructor(
    @InjectRepository(ServiceProvidersEntity)
    private serviceProviderRepository: Repository<ServiceProvidersEntity>,
  ) {
    super({
      passReqToCallback: true,
      secretOrKey: JwtConfig.serviceProviderAccessTokenConfig.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(_req: any, payload: AuthData) {
    if (!payload) throw new UnauthorizedException();
    if (payload.type !== 'SERVICE_PROVIDER') throw new Error('Unauthorized');
    return payload;
  }
}

@Injectable()
export class ServiceProviderRefreshAuthStrategy extends PassportStrategy(
  JWTStrategy,
  'service-partner-jwt-refresh',
) {
  constructor() {
    super({
      secretOrKey: JwtConfig.serviceProviderRefreshTokenConfig.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return _.get(req, 'body.refreshToken');
        },
      ]),
    });
  }
  async validate(_req: Request, payload: AuthData) {
    const validToken = Jwt.verify(
      _req.body.refreshToken,
      JwtConfig.serviceProviderRefreshTokenConfig.secret,
    );
    if (!validToken) throw new UnauthorizedException();
    return payload;
  }
}
