import { getRequestFromContext } from '@base/auth/auth.utils';
import { MobileJwtAccessAuthGuard, WebJwtAccessAuthGuard } from '@guards/auth.guard';
import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiBearerAuth } from '@nestjs/swagger';
import _ from 'lodash';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = getRequestFromContext(ctx);
  return request.user;
});

export const GqlAuthUser = createParamDecorator((_data, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext();
  if (req.ip && req.user) {
    _.set(req.user, 'ip', req.ip);
  } else {
    _.assign(req, { user: { ip: req.ip } });
  }
  return req.user;
});

export const GetAuthData = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const GqlGetGqlAuthData = createParamDecorator((_data, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext();
  return req.user;
});
export const AuthData = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const UseApiAdminAuthGuard = () => {
  return applyDecorators(ApiBearerAuth(), UseGuards(WebJwtAccessAuthGuard));
};

export const UseApiMobileAuthGuard = () => {
  return applyDecorators(ApiBearerAuth(), UseGuards(MobileJwtAccessAuthGuard));
};
