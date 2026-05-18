import type { ReactNode } from 'react';
import { cx } from './utils';

interface SectionEyebrowProps {
  children: ReactNode;
  /** Optional extra classes; defaults already include `mb-3`. */
  className?: string;
}

/**
 * In-page section label — a small mono uppercase tag in the primary
 * color that sits above each major H2 ("Features", "Pricing", "FAQ").
 *
 * Distinct from `HeroBadge`, which is the single sentence-case pill in
 * the hero. Per the Forjio landing family rules: hero badge = sentence
 * case; section eyebrow = mono + uppercase + tracking-wider.
 */
export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <p className={cx('text-xs font-mono uppercase tracking-wider text-primary mb-3', className)}>
      {children}
    </p>
  );
}
