import type { Ctx, CtxStatic, DocumentgetInitialProps, InitialData } from '@lomray/after';
import type { FC, ReactNode } from 'react';

/**
 * Type for functional SSR component
 */
export type SSRComponent<TP = Record<string, any>> = FC<TP & InitialData> & {
  getInitialProps?: (props: Ctx) => any;
  getStaticInitialProps?: (props: CtxStatic<any>) => any;
};

/**
 * Type for layout
 */
export type SSRLayoutComponent<TP = Record<string, any>> = FC<TP & { children?: ReactNode }> & {
  getInitialProps?: (props: DocumentgetInitialProps) => any;
};
