/* eslint-disable @typescript-eslint/naming-convention */
import 'express';
import type Cookies from 'universal-cookie';
// @ts-ignore
import type i18n from '../services/localization';

declare module 'express' {
  export interface Request {
    i18n: typeof i18n;
    universalCookies?: Cookies;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    i18n: typeof i18n;
  }
}
