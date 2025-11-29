import 'dotenv/config';

export const SALT_ROUNDS = 10;
export const REFRESH_TOKEN_SALT_ROUNDS = 10;

const secret = process.env.JWT_SECRET || 'oTAyM9Eem91T1HLZ';
if (!secret) throw new Error('JWT_SECRET cannot be null');

export const JWT_ACCESS_TOKEN_CONFIG = {
  secret: `access_${secret}`,
  expiresIn: '1d',
};

export const JWT_REFRESH_TOKEN_CONFIG = {
  secret: `refresh_${secret}`,
  expiresIn: '1d',
};

export const JWT_PASSWORD_RESET_TOKEN_CONFIG = {
  secret: `password_reset_${secret}`,
  expiresIn: '1d',
};

const customerAccessTokenConfig = {
  secret: `access_${secret}`,
  expiresIn: '1s',
};

const customerRefreshTokenConfig = {
  secret: `refresh_${secret}`,
  expiresIn: '5d',
};

export const customerResetPasswordTokenConfig = {
  secret: `reset_password_${secret}_customer`,
  expiresIn: '30m',
};

const adminAccessTokenConfig = {
  secret: `access_${secret}_admin`,
  expiresIn: '1d',
};

const adminRefreshTokenConfig = {
  secret: `refresh_${secret}_admin`,
  expiresIn: '5d',
};

const adminResetPasswordTokenConfig = {
  secret: `reset_password_${secret}_admin`,
  expiresIn: '30m',
};

export const accessTokenConfig = {
  secret: `access_${secret}`,
  expiresIn: '30d',
};

export const refreshTokenConfig = {
  secret: `refresh_${secret}`,
  expiresIn: '365d',
};

const serviceProviderAccessTokenConfig = {
  secret: `access_${secret}_service_partner`,
  expiresIn: '1d',
};

const serviceProviderRefreshTokenConfig = {
  secret: `refresh_${secret}_service_partner`,
  expiresIn: '5d',
};

const serviceProviderResetPasswordTokenConfig = {
  secret: `reset_password_${secret}_service_partner`,
  expiresIn: '30m',
};
const JwtConfig = {
  customerAccessTokenConfig,
  customerRefreshTokenConfig,
  customerResetPasswordTokenConfig,
  adminAccessTokenConfig,
  adminRefreshTokenConfig,
  adminResetPasswordTokenConfig,
  serviceProviderAccessTokenConfig,
  serviceProviderRefreshTokenConfig,
  serviceProviderResetPasswordTokenConfig,
  accessTokenConfig,
  refreshTokenConfig,
};

export default JwtConfig;
