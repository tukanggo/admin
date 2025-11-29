import { AppAuthorizerOptions } from '@base/app.type';
import { CustomersEntity } from '@entities';
import { FileUpload } from 'graphql-upload';

export interface AuthData {
  id: number;
  name: string;
  email: string;
  phoneCountryCode?: string;
  phoneNumber: string;
  type: 'Admin' | 'Customer' | 'SERVICE_PROVIDER';
}
export type AppContextReq = {
  headers: Record<string, string>;
  user: CustomersEntity;
  appAuthorizerOptions?: AppAuthorizerOptions;
};

export type AppContext = {
  req: AppContextReq;
};

export interface ExpireDate {
  exp: number;
}

export type GqlContext = {
  req: { headers: Record<string, string>; user: AuthData };
};

export type GqlFileUpload = string | FileUpload;
