import ScrollRestorationService from '@lomray/client-helpers-react/services/scroll-restoration';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restore scroll after go to previous page
 * @constructor
 */
const ScrollRestoration: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => ScrollRestorationService.addListeners(pathname), []);
  useEffect(() => ScrollRestorationService.handleNavigate(pathname), [pathname]);

  return null;
};

export default ScrollRestoration;
