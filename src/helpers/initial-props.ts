import type { InitialData, Ctx } from '@lomray/after';
import type { TStoreDefinition, StoresType } from '@lomray/react-mobx-manager';
import type { SSRComponent } from '../interfaces/ssr-component';

type InitialPropsReturnParams = { statusCode?: number } & InitialData;
type InitialPropsReturn = Promise<void> | void | InitialPropsReturnParams;

/**
 * Wrapper for getInitialProps method (mobx)
 * @constructor
 */
const InitialProps = <TP>(
  handler: (stores: StoresType<TP>, ctx: Ctx) => InitialPropsReturn,
  Component: SSRComponent,
  stores: TP,
) => {
  const contextId = 'ssr';

  Component['contextId'] = contextId;
  Component.getInitialProps = (ctx: Ctx): InitialPropsReturn => {
    // @ts-ignore
    const { storeManager } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const map = Object.entries(stores) as [string, TStoreDefinition][];

    return handler(
      storeManager.createStores(
        map,
        'root',
        storeManager.createContextId(contextId),
      ) as StoresType<TP>,
      ctx,
    );
  };
};

export default InitialProps;
