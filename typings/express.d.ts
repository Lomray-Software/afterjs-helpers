/* eslint-disable @typescript-eslint/naming-convention */
import 'express';
import type Cookies from 'universal-cookie';
import type i18n from '../src/services/localization';

declare module 'express' {
  export interface Request {
    i18n: typeof i18n;
    universalCookies?: Cookies;
  }
}
