import schedule from 'node-schedule';
import type { IBuildSiteMapConfig } from '../services/build-site-map';
import buildSiteMap from '../services/build-site-map';

interface ISitemapGenerationOptions {
  isProd?: boolean;
}

/**
 * Generate sitemap
 * - sitemap.xml
 * - sitemap.json (for create visual map page)
 */
const enableSitemapGeneration = (
  publicPath: string,
  config: IBuildSiteMapConfig,
  { isProd = false }: ISitemapGenerationOptions = {},
): void => {
  if (!isProd) {
    return;
  }

  // generate sitemap every day
  schedule.scheduleJob('0 * * * *', () => {
    buildSiteMap({ ...config, destinationPath: publicPath }).catch((e) => {
      console.info(`Error build sitemap: ${e.message as string}`);
    });
  });
};

export default enableSitemapGeneration;
