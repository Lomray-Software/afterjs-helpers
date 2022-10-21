/* eslint-disable @typescript-eslint/no-var-requires */
import glob from 'glob';
import resolveAppPath from './resolve-app-path';

const getPublicPath = (publicDir?: string) =>
  // true - 'razzle start' only (for development /public) in other cases we need /build/public
  process.env.WEBPACK_DEV_SERVER === 'true' ? publicDir || '' : resolveAppPath('build/public');

// get manifest.json name if exist
const getManifestPath = (rootDir: string) =>
  glob.sync(`${rootDir}/**/manifest*.json`)?.[0]?.split('/').pop();
// get apple icons if exist (pwa)
const getIosIcons = (rootDir: string) =>
  glob.sync(`${rootDir}/**/icons/ios/*.*`).map((iconPath) => ({
    link: `/icons/ios/${iconPath.split('/').pop() || ''}`,
    size: /[\d]+x[\d]+/.exec(iconPath)?.[0] ?? '',
  }));

export { getPublicPath, getManifestPath, getIosIcons };
