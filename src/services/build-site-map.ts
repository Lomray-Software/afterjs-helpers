import fs from 'fs';
import type { AxiosResponse } from 'axios';

export interface IStaticPageInfo {
  [path: string]: {
    fetch?: (lang: string) => Promise<AxiosResponse<Record<string, any>>>;
    getTitle?: (entity: Record<string, any>) => string | undefined;
    getDate?: (entity: Record<string, any>) => string | undefined;
    title?: string;
  };
}

export interface IDynamicPageInfo {
  [path: string]:
    | {
        fetch: (lang: string, start: number, limit: number) => Promise<AxiosResponse>;
        getTitle: (entity: Record<string, any>) => string | undefined;
        getPath: (entity: Record<string, any>, path: string) => (string | undefined)[];
        getDate?: (entity: Record<string, any>) => string | undefined;
      }
    | undefined;
}

interface IPageInfo {
  url: string;
  title: string;
  modDate?: string;
}

export interface IBuildSiteMapConfig {
  domain: string;
  defaultLocale: string;
  locales: string[];
  excludes: string[];
  routes: { path?: string }[];
  staticPagesInfo: IStaticPageInfo | ((locale: string) => IStaticPageInfo);
  dynamicPagesInfo: IDynamicPageInfo;
  batchSize?: number;
  destinationPath?: string;
}

/**
 * Build link by array parts, ignore empty elements
 * Example: [part-one, part-two] => /part-one/part-two
 */
const getLink = (parts: (string | undefined)[]): string => parts.filter(Boolean).join('/');

/**
 * Get sitemap xml date format
 * Output format: 2021-12-08
 */
const getDate = (initialDate?: string): string => {
  const date = new Date(initialDate ?? new Date());
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * Create sitemap xml and replace exist sitemap
 */
const createSitemapXml = (
  routesData: IPageInfo[],
  domain: string,
  destinationPath: string,
): void => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routesData
    .map(
      ({ url, modDate }) => `
<url>
  <loc>${domain}${url}</loc>
  <lastmod>${modDate || getDate()}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1.0</priority>
</url>
`,
    )
    .join('')}</urlset>`;

  // regexp for remove empty lines
  fs.writeFile(`${destinationPath}/sitemap.xml`, sitemap.replace(/(^[ \t]*\n)/gm, ''), 'utf8', () =>
    console.info('Sitemap xml generated for default locale.'),
  );
};

/**
 * Generates sitemap routes for next features
 * - create xml sitemap
 * - create web page with site map
 */
const buildSiteMap = async ({
  domain,
  defaultLocale,
  locales,
  excludes,
  routes,
  staticPagesInfo,
  dynamicPagesInfo,
  batchSize = 20,
  destinationPath = './public',
}: IBuildSiteMapConfig): Promise<void> => {
  const otherLanguages = locales.filter((lng) => defaultLocale !== lng);

  for (const locale of locales) {
    const { staticPages, dynamicPages } = routes
      .map((route) => {
        if (route.path) {
          return (Array.isArray(route.path) ? route.path : [route.path]).map((path: string) => {
            // check if exist routes for another locales
            if (otherLanguages.length > 0) {
              const isUrlContainLngPrefix = otherLanguages.some((lng) =>
                path.startsWith(`/${lng}`),
              );

              if (isUrlContainLngPrefix) {
                return;
              }
            }

            return path;
          });
        }

        return undefined;
      })
      .flat()
      .filter(Boolean)
      .reduce(
        (result: { staticPages: string[]; dynamicPages: string[] }, path: string) => {
          const isExclude = excludes.some((exclude) => path.startsWith(exclude));

          if (!isExclude) {
            if (/[:?]+/.test(path)) {
              result.dynamicPages.push(path);
            } else {
              result.staticPages.push(path);
            }
          }

          return result;
        },
        { staticPages: [], dynamicPages: [] },
      );

    const infoStaticPages: IPageInfo[] = [];
    const staticPagesData =
      typeof staticPagesInfo === 'function' ? staticPagesInfo(locale) : staticPagesInfo;

    // build static pages
    while (infoStaticPages.length < staticPages.length) {
      const request: Promise<any>[] = staticPages
        .slice(infoStaticPages.length, infoStaticPages.length + 3)
        .map((path) => {
          const pathParams = staticPagesData[path];

          if (pathParams?.fetch) {
            return pathParams
              .fetch(locale)
              .then(({ data }) => ({
                url: path,
                title: pathParams.getTitle?.(data),
                modDate: pathParams.getDate?.(data),
              }))
              .catch(() => ({ path, title: '' }));
          }

          return Promise.resolve({ url: path, title: pathParams?.title || '' });
        })
        .filter(Boolean);

      // eslint-disable-next-line no-await-in-loop
      infoStaticPages.push(...((await Promise.all(request)) as IPageInfo[]));
    }

    const infoDynamicPages: IPageInfo[] = [];

    for (const path of dynamicPages) {
      const [firstPart] = path.split('/:');
      const pathParams = dynamicPagesInfo[firstPart];

      if (!pathParams) {
        continue;
      }

      let isContinueFetch = true;
      let currentSize = 0;

      while (isContinueFetch) {
        // eslint-disable-next-line no-await-in-loop
        const result = (await pathParams.fetch(locale, currentSize, batchSize))?.data ?? [];

        result.forEach((row: Record<string, any>) => {
          infoDynamicPages.push({
            url: getLink(pathParams.getPath(row, firstPart)),
            title: pathParams.getTitle(row) || '',
            modDate: getDate(pathParams.getDate?.(row)),
          });
        });

        currentSize += batchSize;

        if (result.length === 0 || result.length < batchSize) {
          isContinueFetch = false;
        }
      }
    }

    const siteRoutes = [...infoStaticPages, ...infoDynamicPages];

    fs.writeFile(
      `${destinationPath}/sitemap-${locale}.json`,
      JSON.stringify(siteRoutes),
      'utf8',
      () => console.info(`Sitemap built complete: ${locale}`),
    );

    if (locale === defaultLocale) {
      createSitemapXml(siteRoutes, domain, destinationPath);
    }
  }
};

export default buildSiteMap;
