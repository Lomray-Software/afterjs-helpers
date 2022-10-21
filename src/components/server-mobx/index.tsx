import { __AfterContext, SerializeData } from '@lomray/after';
import type { FC } from 'react';
import React from 'react';

/**
 * Pass server mobx stores data to client
 * @constructor
 */
const ServerMobx: FC = () => {
  // @ts-ignore
  const { storeManager } = React.useContext(__AfterContext);

  return <SerializeData name="preloadedState" data={storeManager.toJSON()} />;
};

export default ServerMobx;
