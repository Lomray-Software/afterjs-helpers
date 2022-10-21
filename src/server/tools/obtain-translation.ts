import type { Request } from 'express';

/**
 * Obtain translation after server render
 * @constructor
 */
const ObtainTranslation = (req: Request, initialLanguage: string): Record<string, any> => {
  const initialI18nStore = {};
  const usedNamespaces = req.i18n?.reportNamespaces?.getUsedNamespaces() ?? [];

  // Get used translation for pass down to client
  for (const language of req?.i18n?.languages ?? []) {
    initialI18nStore[language] = {};

    usedNamespaces.forEach((namespace) => {
      initialI18nStore[language][namespace] =
        req.i18n.services.resourceStore.data[language][namespace];
    });

    // Pass to client side only one language (current)
    if (initialLanguage.includes(language) && initialI18nStore[language]) {
      break;
    }
  }

  return initialI18nStore;
};

export default ObtainTranslation;
