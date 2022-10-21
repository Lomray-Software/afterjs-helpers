import type { FC } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinkProps } from 'react-router-dom';
import { Link as DefaultLink } from 'react-router-dom';
import customI18n from '../../services/localization';

/**
 * Extends react router dom Link component
 * - remove trailing slash if current language not default on home link (e.g. /) (investigation)
 * - SSR return link with lang code
 * @constructor
 */
const Link: FC<LinkProps & { isLocalized?: boolean }> = (props) => {
  const { isLocalized = true, ...linkProps } = props;
  const { to, children, ...other } = linkProps;
  const { i18n } = useTranslation();

  const lng = customI18n.getLngCode!(i18n);
  const isNotDefaultLang = useMemo(() => lng !== customI18n.defaultLng, [lng]);

  if (isLocalized && isNotDefaultLang && typeof to === 'string') {
    return (
      <DefaultLink
        to={`/${lng}${to.startsWith('/') ? to : `/${to}`}`.replace(/\/+$/, '')}
        {...other}
      >
        {children}
      </DefaultLink>
    );
  }

  return <DefaultLink {...linkProps} />;
};

export default Link;
