import type { DetectorOptions } from 'i18next-browser-languagedetector';

/**
 * Detect language prefix
 * @constructor
 */
const ClientPathCustomDetector = (defaultLanguage: string) => ({
  name: 'path',

  lookup(options: DetectorOptions): string | undefined {
    let found;

    if (typeof window !== 'undefined') {
      const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);

      if (Array.isArray(language)) {
        if (typeof options.lookupFromPathIndex === 'number') {
          if (typeof language[options.lookupFromPathIndex] !== 'string') {
            return undefined;
          }

          found = language[options.lookupFromPathIndex].replace('/', '');
        } else {
          found = language[0].replace('/', '');
        }
      }
    }

    if (!found || !options?.allowPath?.includes(found)) {
      // Simulate fallback lang
      found = defaultLanguage;
    }

    return found;
  },
});

export default ClientPathCustomDetector;
