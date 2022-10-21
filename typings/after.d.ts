/* eslint-disable import/prefer-default-export,@typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-interface */
// noinspection JSUnusedGlobalSymbols
import '@lomray/after';

declare module '@lomray/after' {
  export interface RenderPageResult {
    initialI18nStore: any;
    initialLanguage: string;
    isOnlyShell?: boolean;
  }
}
