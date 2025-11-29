import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import {
  WebAccessAuthStrategy,
  WebRefreshAuthStrategy,
  MobileAccessAuthStrategy,
  MobileRefreshAuthStrategy,
  ServiceProviderJwtAuthStrategy,
  ServiceProviderRefreshAuthStrategy,
} from '@guards/auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import {
  AdminsEntity,
  CustomerPointsEntity,
  CustomersEntity,
  CustomerVerificationsEntity,
  ServiceProvidersEntity,
} from 'src/entities';
import { ServiceProviderAuthService } from './service-providers.auth.service';
import { ServicePartnerAuthController } from './service-providers.auth.controller';
import { ServiceProviderAuthResolver } from './service-provider.auth.resolver';
import { UserAuthService } from './user.auth.service';
import { UserAuthController } from './user.auth.controller';

const Entities = [
  AdminsEntity,
  CustomersEntity,
  CustomerVerificationsEntity,
  ServiceProvidersEntity,
  CustomerPointsEntity,
];
const Services = [AuthService, ServiceProviderAuthService, UserAuthService];
const Strategies = [
  WebAccessAuthStrategy,
  WebRefreshAuthStrategy,
  MobileAccessAuthStrategy,
  MobileRefreshAuthStrategy,
  ServiceProviderJwtAuthStrategy,
  ServiceProviderRefreshAuthStrategy,
];
const Resolvers = [AuthResolver, ServiceProviderAuthResolver];

@Module({
  imports: [TypeOrmModule.forFeature(Entities), PassportModule, JwtModule.register({})],
  providers: [...Services, ...Strategies, ...Resolvers],
  exports: [AuthService, ServiceProviderAuthService, AuthModule],
  controllers: [AuthController, ServicePartnerAuthController, UserAuthController],
})
export class AuthModule {}
