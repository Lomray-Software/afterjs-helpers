import type { ISetupCache } from 'axios-cache-adapter';
import type { Request, Response } from 'express';

interface IRequestAdapterStore {
  clear?: () => Promise<void> | void;
}

interface IAxiosRequestAdapterParams {
  resetCacheEndpointToken?: string;
}

type TAxiosRequestAdapter = Omit<ISetupCache, 'store'> & { store: IRequestAdapterStore };

/**
 * Axios request adapter
 */
class AxiosRequestAdapter {
  /**
   * Axios cache adapter
   * @private
   */
  private cache: TAxiosRequestAdapter;

  /**
   * Axios request adapter params
   * @private
   */
  private params: IAxiosRequestAdapterParams;

  /**
   * Init cache request adapter
   */
  public init(cache: TAxiosRequestAdapter, params: IAxiosRequestAdapterParams) {
    this.cache = cache;
    this.params = params;
  }

  /**
   * Get axios adapter
   */
  public getAdapter() {
    return this.cache?.adapter;
  }

  /**
   * Reset memory cache
   */
  public resetCache(): Promise<void> | void {
    return this.cache?.store?.clear?.();
  }

  /**
   * Express endpoint handler for reset cache
   */
  public setResetCacheEndpoint(req: Request, res: Response) {
    const { resetCacheEndpointToken } = this.params;
    const authToken = req.header('Authorization');

    if (!resetCacheEndpointToken || authToken === `Bearer ${resetCacheEndpointToken}`) {
      void this.resetCache();

      res.send('Cache flushed.');

      return;
    }

    res.send('Ok.');
  }
}

export default new AxiosRequestAdapter();
