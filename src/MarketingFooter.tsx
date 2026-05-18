import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { MarketingFooterProps, FooterColumn } from './types';

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/docs', label: 'Documentation' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/refund', label: 'Refund Policy' },
    ],
  },
];

// Locked PT Forjio info — the legal entity for every Forjio SaaS. Only
// override via the `company` prop if you genuinely have a different
// operating entity (you don't).
const DEFAULT_COMPANY: NonNullable<MarketingFooterProps['company']> = {
  name: 'PT Forjio Teknologi Indonesia',
  address: (
    <>
      Jl. Parkit, Blok I, No. 48, RT 004, RW 001,
      <br />
      Cempaka Permai, Gading Cempaka,
      <br />
      Bengkulu, Bengkulu 38221
    </>
  ),
  phoneLabel: '+62 815-2999-0219',
  phoneHref: 'tel:+6281529990219',
  email: 'support@forjio.com',
};

export function MarketingFooter({
  brandIcon,
  brandName,
  brandTagline,
  columns = DEFAULT_COLUMNS,
  copyrightSuffix = 'part of the Forjio family.',
  company = DEFAULT_COMPANY,
}: MarketingFooterProps) {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              {brandIcon}
              <span className="font-bold tracking-tight">{brandName}</span>
            </Link>
            {brandTagline && (
              <p className="mt-3 text-sm text-muted-foreground">{brandTagline}</p>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-border/50 pt-8 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="space-y-1.5">
            <p className="font-medium text-foreground">{company.name}</p>
            <p className="flex items-start gap-2">
              <MapPin size={13} className="mt-0.5 shrink-0" />
              <span>{company.address}</span>
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="flex items-center gap-2">
              <Phone size={13} className="shrink-0" />
              <a href={company.phoneHref} className="hover:text-foreground">
                {company.phoneLabel}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={13} className="shrink-0" />
              <a href={`mailto:${company.email}`} className="hover:text-foreground">
                {company.email}
              </a>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p>&copy; {new Date().getFullYear()} {company.name}.</p>
            {copyrightSuffix && <p className="mt-1">{copyrightSuffix}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
