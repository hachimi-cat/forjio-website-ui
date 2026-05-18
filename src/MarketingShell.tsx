import type { ReactNode } from 'react';
import { cx } from './utils';

interface MarketingShellProps {
  children: ReactNode;
  /**
   * Extra classes spliced onto the root flex column. Most products won't
   * need this — the defaults match the linksnap canon (full-height dark
   * column with the `.marketing-site` opt-in for Gellix headings).
   */
  className?: string;
}

/**
 * Wraps every page in `app/(marketing)/`. The `.marketing-site` class
 * is the opt-in that pairs with the `marketing.css` rule:
 *
 *   .marketing-site :is(h1, h2, h3, h4, h5, h6) {
 *     font-family: var(--font-display), ...;
 *   }
 *
 * Portal pages omit the wrapper so their headings stay on the body font.
 */
export function MarketingShell({ children, className }: MarketingShellProps) {
  return (
    <div className={cx('marketing-site flex min-h-screen flex-col', className)}>
      {children}
    </div>
  );
}
