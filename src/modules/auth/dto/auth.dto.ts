import { ApiProperty } from '@nestjs/swagger';
import { InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StandardResponse {
  @ApiProperty({ example: 'Success' })
  message: string;
  @ApiProperty({ example: 200 })
  statusCode: number;
}

export class authData {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() phoneNumber: string;
}

/* ---------------------------------- Login DTO --------------------------------- */
export class LoginDTO {
  @ApiProperty({ example: 'user01@test.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

class LoginResponsePayload {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty() accessTokenExpiry: number;
  @ApiProperty() resetPasswordToken?: string;
  @ApiProperty() data: authData;
}
export class LoginResponseDTO extends StandardResponse {
  @ApiProperty()
  payload: LoginResponsePayload;
}

/* ------------------------------ Refresh Token DTO ----------------------------- */
export class RefreshTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
export class LogoutDTO {
  @ApiProperty()
  fcmToken?: string;
}

class RefreshTokenResponsePayload {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty() accessTokenExpiry: number;
  @ApiProperty() data: authData;
}
export class RefreshTokenResponseDTO extends StandardResponse {
  @ApiProperty()
  payload: RefreshTokenResponsePayload;
}

@InputType()
export class VerifyPhoneNoInput {
  @ApiProperty({ example: '+60' })
  phoneCountryCode: string;

  @ApiProperty({ example: '182345678' })
  phoneNumber: string;

  @ApiProperty()
  code: string;
}

@InputType()
export class UserRegisterInput {
  @ApiProperty({ example: '+60' })
  phoneCountryCode: string;

  @ApiProperty({ example: '182345678' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'user@test.com' })
  email: string;

  @ApiProperty({ example: 'qwer1234' })
  password: string;

  @ApiProperty({ example: 'peter123' })
  username?: string;

  @ApiProperty({ example: 'asd12321w' })
  referralCode?: string;

  @ApiProperty({ example: '123456' })
  otp: string;
}
@InputType()
export class ServiceProviderRegisterInput {
  @ApiProperty({ example: '+60' })
  phoneCountryCode: string;

  @ApiProperty({ example: '182345678' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'user@test.com' })
  email: string;

  @ApiProperty({ example: 'qwer1234' })
  password: string;

  @ApiProperty({ example: 'peter123' })
  username?: string;

  @ApiProperty({ example: 'peter123' })
  companyName?: string;

  @ApiProperty({ example: 'peter123' })
  companySSM?: string;

  @ApiProperty({ example: 'asd12321w' })
  referralCode?: string;

  @ApiProperty({ example: '123456' })
  otp: string;
}

@InputType()
export class UserLoginInput {
  @ApiProperty({ nullable: true })
  phoneCountryCode: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ nullable: true })
  password?: string;
}

@InputType()
export class UserEmailRegisterInput {
  @ApiProperty({ example: 'qwer@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'qwerty123456' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'qwerty123456' })
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({ example: '1234QWE' })
  referralCode?: string;
}

@InputType()
export class checkEmailInput {
  @ApiProperty({ example: 'qwer@gmail.com' })
  @IsNotEmpty()
  email: string;
}

@InputType()
export class checkPhoneInput {
  @ApiProperty({ nullable: true })
  phoneCountryCode: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;
}

@InputType()
export class checkOTPInput {
  @ApiProperty({ nullable: true })
  phoneCountryCode: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ nullable: true })
  resetPasswordOTP: string;
}

@InputType()
export class checkReferralCodeInput {
  @ApiProperty({ example: '1234qwe' })
  @IsNotEmpty()
  referralCode: string;
}

@InputType()
export class UserEmailLoginInput {
  @ApiProperty({ example: 'qwer@gmail.com' })
  email?: string;

  @ApiProperty({ example: 'qwerty123456' })
  password: string;
}

@InputType()
export class resetPasswordInput {
  @ApiProperty()
  resetToken?: string;

  @ApiProperty({ example: 'qwerty123456' })
  newPassword: string;
}

@InputType()
export class serviceProviderOTPResetPasswordInput {
  @ApiProperty({ nullable: true })
  phoneCountryCode: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;

  @ApiProperty()
  otp?: string;

  @ApiProperty({ example: 'qwerty123456' })
  newPassword: string;
}

@InputType()
export class OTPResetPasswordInput {
  @ApiProperty({ nullable: true })
  phoneCountryCode: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;

  @ApiProperty()
  otp?: string;

  @ApiProperty({ example: 'qwerty123456' })
  newPassword: string;
}

@InputType()
export class serviceProviderResetPasswordInput {
  @ApiProperty()
  resetToken?: string;

  @ApiProperty({ example: 'qwerty123456' })
  newPassword: string;
}

@InputType()
export class UserChangePassInput {
  @ApiProperty({ example: 'qwerty123456' })
  password: string;

  @ApiProperty({ example: 'qwerty123456' })
  newPassword: string;
}

@InputType()
export class ServiceProviderChangePassInput {
  @ApiProperty({ example: 'qwerty123456' })
  newPassword: string;
}

@InputType()
export class facebookLoginInput {
  @ApiProperty()
  facebookToken: string;
}
@InputType()
export class googleLoginInput {
  @ApiProperty()
  googleToken: string;
}
@InputType()
export class appleLoginInput {
  @ApiProperty()
  appleToken: string;
}
@InputType()
export class SocialLoginOnboardingInput {
  @ApiProperty({ nullable: true })
  facebookToken?: string;

  @ApiProperty({ nullable: true })
  googleToken?: string;

  @ApiProperty({ nullable: true })
  appleToken?: string;

  @ApiProperty({ nullable: true })
  phoneCountryCode: string;

  @ApiProperty({ nullable: true })
  referralCode: string;

  @ApiProperty({ nullable: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  dob: string;
}
