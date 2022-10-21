/* eslint-disable @typescript-eslint/naming-convention */
import type { DetectorOptions as DefaultDetectorOptions } from 'i18next-browser-languagedetector';

declare module 'i18next-browser-languagedetector' {
  interface DetectorOptions extends DefaultDetectorOptions {
    allowPath?: string[];
  }
}
