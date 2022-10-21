import PageLoading from '@lomray/client-helpers-react/services/page-loading';
import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBarComponent from 'react-top-loading-bar';

interface ILoadingBar {
  color?: string;
}

/**
 * Loading page line
 * @constructor
 */
const LoadingBar: FC<ILoadingBar> = ({ color = '#8f5fe8' }) => {
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => PageLoading.setLoadingBarRef(ref), []);

  return <LoadingBarComponent color={color} ref={ref} />;
};

export default LoadingBar;
