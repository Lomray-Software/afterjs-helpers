// @ts-ignore
import type { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { setupCache } from 'axios-cache-adapter';
import type { Express } from 'express';
import AxiosRequestAdapter from '../services/axios-request-adapter';

const config: IAxiosCacheAdapterOptions = {
  maxAge: 60 * 60 * 1000, // 1 hour
  exclude: { query: false },
};

interface IAxiosCacheConfig {
  isProd?: boolean;
  resetCacheToken?: string;
}

/**
 * Enable axios cache requests on server side
 * PS. cache only GET requests
 */
const enableAxiosCache = (
  express: Express,
  { resetCacheToken, isProd = false }: IAxiosCacheConfig = {},
): void => {
  if (!isProd) {
    return;
  }

  const axiosCache = setupCache(config);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  AxiosRequestAdapter.init(axiosCache, { resetCacheEndpointToken: resetCacheToken });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  express.get('/reset-cache', AxiosRequestAdapter.setResetCacheEndpoint.bind(AxiosRequestAdapter));
};

export default enableAxiosCache;
