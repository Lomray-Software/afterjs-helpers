import { __AfterContext, SerializeData } from '@lomray/after';
import type { FC } from 'react';
import React from 'react';

/**
 * Pass server translation to client
 * @constructor
 */
const ServerTranslation: FC = () => {
  const { initialI18nStore, initialLanguage } = React.useContext(__AfterContext);

  return (
    <>
      <SerializeData name="initialI18nStore" data={initialI18nStore} />
      <SerializeData name="initialLanguage" data={initialLanguage} />
    </>
  );
};

export default ServerTranslation;
