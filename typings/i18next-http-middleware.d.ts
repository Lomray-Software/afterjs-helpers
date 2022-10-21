/* eslint-disable @typescript-eslint/naming-convention */
import type { LanguageDetectorOptions as DefaultDetectorOptions } from 'i18next-http-middleware';

declare module 'i18next-http-middleware' {
  interface LanguageDetectorOptions extends DefaultDetectorOptions {
    allowPath?: string[];
  }
}
