import type { Express, Handler, Request, Response } from 'express';
import express from 'express';
import type { i18n as Ti18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import CustomPathDetector from '../helpers/server-path-custom-detector';
import resolveAppPath from './tools/resolve-app-path';

/**
 * This file contains config translation for server side
 */

const getBackendLocalesPaths = (localesSrc: string) => ({
  loadPath: `${localesSrc}/locales/{{lng}}/{{ns}}.json`,
  addPath: `${localesSrc}/locales/{{lng}}/{{ns}}.missing.json`,
});

export interface IServerTranslationConfig {
  i18n: Ti18n;
  nsLng: Record<string, any>;
  defaultLng: string;
  allLng: string[];
  isProd?: boolean;
}

/**
 * Only for SSR
 */
const initServerTranslation = (
  server: Express,
  config: IServerTranslationConfig,
): Promise<Handler> => {
  const { i18n, defaultLng, nsLng, allLng, isProd = false } = config;
  const localesSrc = resolveAppPath(isProd ? 'build/public' : 'src/assets');
  const otherLng = allLng.filter((l) => defaultLng !== l);
  const lngDetector = new i18nextMiddleware.LanguageDetector(null, {
    allowPath: otherLng,
  });

  return new Promise((resolve, reject) => {
    i18n
      .use(Backend)
      .use(lngDetector)
      .init(
        {
          lng: defaultLng,
          supportedLngs: allLng,
          preload: allLng,
          ns: Object.keys(nsLng),
          backend: getBackendLocalesPaths(localesSrc),
        },
        () => {
          // do not move this line
          lngDetector.addDetector(CustomPathDetector(defaultLng));

          /**
           * Use static locales' endpoint
           * NOTE: it should use before RAZZLE static middleware
           */
          server.use('/locales', express.static(`${localesSrc}/locales`));

          /**
           * Add i18n middleware for detect request locale
           * NOTE: it should use after all static middlewares
           */
          resolve(i18nextMiddleware.handle(i18n));
        },
      )
      .catch((e) => reject(e));
  });
};

/**
 * Only for SSG mode
 */
const applySSGTranslation = async (
  req: Request,
  res: Response,
  config: IServerTranslationConfig,
): Promise<void> => {
  const { i18n, defaultLng, allLng, nsLng, isProd = false } = config;
  const localesSrc = resolveAppPath(isProd ? 'build/public' : 'src/assets');
  const otherLng = allLng.filter((l) => defaultLng !== l);

  const pathDetector = CustomPathDetector(defaultLng);
  // find request language by request url
  const lng = pathDetector.lookup(req, res, {
    lookupFromPathIndex: 0,
    allowPath: otherLng,
    getOriginalUrl: (r: Request) => r.url,
  });

  await i18n.use(Backend).init({
    preload: allLng,
    ns: Object.keys(nsLng),
    backend: getBackendLocalesPaths(localesSrc),
  });
  await i18n.changeLanguage(lng);

  req.i18n = i18n;
};

export { initServerTranslation, applySSGTranslation };
