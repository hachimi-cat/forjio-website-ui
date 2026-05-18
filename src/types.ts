import type { ComponentType, ReactNode, SVGProps } from 'react';

/**
 * Brand icon shape that mirrors a lucide-react icon component. Consumers
 * pass `Link2` / `Package` / `CreditCard` etc. directly; we render it
 * with the canonical color + stroke.
 */
export type BrandIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

export interface NavLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface MarketingNavProps {
  /**
   * Rendered brand icon element (e.g. `<Link2 className="h-6 w-6 text-primary" />`).
   * Pre-rendered as ReactNode because MarketingNav is a Client Component
   * and Next App Router forbids passing function components across the
   * Server → Client boundary. The consumer (which is a Server Component
   * layout) renders the icon itself with the canonical classes.
   *
   * Canonical classes: `h-6 w-6 text-primary` for the navbar.
   */
  brandIcon: ReactNode;
  /** Product wordmark (e.g. "LinkSnap"). */
  brandName: string;
  /** Override the default `/features /pricing /docs` set. */
  navLinks?: NavLink[];
  /** Path to the home page; defaults to "/". */
  homeHref?: string;
  /** Path to the login route; defaults to "/login". Pass null to hide. */
  loginHref?: string | null;
  /** Path to the CTA; defaults to "/signup". */
  ctaHref?: string;
  /** CTA label; defaults to "Get Started". */
  ctaLabel?: string;
  /**
   * Replace the right-hand login + CTA pair entirely. Useful for the
   * portal-style "Open dashboard" single button some products use.
   */
  rightSlot?: ReactNode;
}

export interface MarketingFooterProps {
  /**
   * Rendered brand icon element. Canonical classes for the footer:
   * `h-5 w-5 text-primary`. See MarketingNavProps.brandIcon for the
   * server/client boundary rationale.
   */
  brandIcon: ReactNode;
  brandName: string;
  /** One-line tagline shown under the brand block. */
  brandTagline?: string;
  /**
   * Override the default three columns (Product / Company / Legal).
   * If omitted, the locked defaults from the linksnap anchor are used.
   */
  columns?: FooterColumn[];
  /**
   * Bottom-row copyright suffix; defaults to "part of the Forjio family."
   * The "© YEAR PT Forjio Teknologi Indonesia." part is always rendered.
   */
  copyrightSuffix?: string;
  /**
   * Override the locked PT Forjio address block. Most products should
   * leave this alone — it's the single legal entity for all of them.
   */
  company?: {
    name: string;
    address: ReactNode;
    phoneLabel: string;
    phoneHref: string;
    email: string;
  };
}
