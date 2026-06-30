'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { MarketingNavProps, NavLink } from './types';
import { cx } from './utils';
import { Button } from './components/ui/button';

const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

/**
 * The Forjio family marketing navbar. Identical chrome across every
 * product — what changes is the brand icon + wordmark and (rarely) the
 * link set. Color comes from CSS vars (`--primary`, `--foreground`,
 * `--border`, `--background`) so each product's globals.css can recolor
 * without touching this file.
 */
export function MarketingNav({
  brandIcon,
  brandName,
  navLinks = DEFAULT_NAV_LINKS,
  homeHref = '/',
  loginHref = '/login',
  ctaHref = '/signup',
  ctaLabel = 'Get Started',
  rightSlot,
}: MarketingNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href={homeHref} className="flex items-center gap-2">
            {brandIcon}
            <span className="text-lg font-bold tracking-tight">{brandName}</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cx(
                  'text-sm transition-colors',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {rightSlot ?? (
            <>
              {loginHref && (
                <Link
                  href={loginHref}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Link>
              )}
              <Button asChild className="shadow-none">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cx(
                  'text-sm transition-colors',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-4">
              {rightSlot ?? (
                <>
                  {loginHref && (
                    <Link
                      href={loginHref}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Log in
                    </Link>
                  )}
                  <Button asChild className="w-full shadow-none">
                    <Link href={ctaHref} onClick={() => setMobileOpen(false)}>
                      {ctaLabel}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
