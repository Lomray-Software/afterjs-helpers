import type { i18n as Ii18n, InitOptions, Callback } from 'i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import type { TFunction, Namespace, TFuncKey } from 'react-i18next';
import CustomPathDetector from '../helpers/client-path-custom-detector';

export type TranslationDictionary = TFuncKey<Namespace>;

interface ICustomI18n extends Omit<Ii18n, 't'> {
  t: TFunction<Namespace>;
  defaultLng?: string;
  getLngCode?: (i18nInstance?: ICustomI18n) => string;
}

const customI18n = i18n as ICustomI18n;

const originalInit: typeof customI18n['init'] = customI18n.init.bind(customI18n);
const customInit = (options: InitOptions, callback?: Callback) => {
  if (customI18n.isInitialized) {
    return callback?.(null, customI18n.t);
  }

  const { lng, supportedLngs } = options;

  const otherLng = Array.isArray(supportedLngs) ? supportedLngs.filter((l) => lng !== l) : [];

  if (process && !process.release) {
    const languageDetector = new LanguageDetector(null, {
      allowPath: otherLng,
    });

    customI18n.use(Backend).use(initReactI18next).use(languageDetector);

    // Client side
    languageDetector.addDetector(CustomPathDetector(lng!));
  }

  customI18n.defaultLng = lng!;

  return originalInit(
    {
      debug: false,
      // fallbackLng: DEFAULT_APP_LANGUAGE, // this load en locale (see network) if current ru, this implemented in detectors
      keySeparator: false,
      load: 'languageOnly',
      defaultNS: 'translation',
      react: {
        useSuspense: false,
      },
      detection: {
        order: ['path'],
      },
      ...options,
    },
    callback,
  );
};

customI18n.init = customInit.bind(customI18n);
customI18n.getLngCode = (i18nInstance) => (i18nInstance || customI18n).language?.split('-')[0];

export default customI18n;
