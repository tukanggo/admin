import {
  Injectable,
  ExecutionContext,
  CanActivate,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthData } from '@types';
import { Reflector } from '@nestjs/core';
import JwtConfig from '@configs/auth.config';
import Jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

// ------------------------------- Strategies -------------------------------
// 'web-jwt-access'
// 'web-jwt-refresh'
// 'mobile-jwt-access'
// 'mobile-jwt-refresh'

// ----------------------------- API Auth Guards ----------------------------
@Injectable()
export class WebJwtAccessAuthGuard extends AuthGuard('web-jwt-access') {}
@Injectable()
export class WebJwtRefreshAuthGuard extends AuthGuard('web-jwt-refresh') {}
@Injectable()
export class MobileJwtAccessAuthGuard extends AuthGuard('mobile-jwt-access') {}
@Injectable()
export class MobileJwtRefreshAuthGuard extends AuthGuard('mobile-jwt-refresh') {}
@Injectable()
export class ServiceProviderJwtAuthGuard extends AuthGuard('service-partner-jwt') {}
@Injectable()
export class ServiceProviderJwtRefreshAuthGuard extends AuthGuard('service-partner-jwt-refresh') {}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!jwtToken) throw new UnauthorizedException();
    const decodedJwt = Jwt.decode(jwtToken) as AuthData;

    let user;
    if (decodedJwt?.type === 'Customer') {
      user = Jwt.verify(jwtToken, JwtConfig.accessTokenConfig.secret);
    } else if (decodedJwt?.type === 'Admin') {
      user = Jwt.verify(jwtToken, JwtConfig.adminAccessTokenConfig.secret);
    } else if (decodedJwt?.type === 'SERVICE_PROVIDER') {
      user = Jwt.verify(jwtToken, JwtConfig.serviceProviderAccessTokenConfig.secret);
    }
    if (!user) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!jwtToken) throw new UnauthorizedException();
    const decodedJwt = Jwt.decode(jwtToken) as AuthData;

    let user;
    if (decodedJwt?.type === 'Admin') {
      user = Jwt.verify(jwtToken, JwtConfig.adminAccessTokenConfig.secret);
    }
    if (!user) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const user = request.user as AuthData;

    if (!user) return false;

    if (user.type === 'Admin') return true;

    if (!roles.includes(user.type))
      throw new ForbiddenException('Insufficient Role permission for this action.');
    return true;
  }
}
