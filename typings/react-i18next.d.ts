/* eslint-disable @typescript-eslint/naming-convention */
// noinspection JSUnusedGlobalSymbols
import 'react-i18next';
import type { ReactNode } from 'react';

declare module 'react-i18next' {
  export interface I18nextProviderProps {
    initialI18nStore?: any;
    initialLanguage?: string;
    children?: ReactNode;
  }
}
