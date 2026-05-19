'use client';

import type { ReactElement } from 'react';
import { useLocale } from './useLocale';

export interface PriceProps {
  /** Indonesian Rupiah amount, integer rupiah (no decimals — IDR has
   *  no minor unit). E.g. 99000 for Rp 99,000. */
  idr: number;
  /** USD amount in cents, integer. E.g. 700 for $7.00. */
  usdCents: number;
  /** Optional suffix appended after the amount. Defaults to nothing.
   *  Common values: '/mo', '/year', or just the amount alone for total
   *  prices like a one-time topup. */
  per?: string;
  /** Locale to format under. Defaults to whatever useLocale() resolves
   *  for this visitor. Pass an explicit override only for the IDR/USD
   *  toggle preview. */
  forceCurrency?: 'IDR' | 'USD';
  className?: string;
}

function fmt(locale: string, currency: string, digits: number) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

// Auto-pick precision based on amount magnitude. Tiny per-unit rates
// (Rp 4.10/GB·hour, $0.000256/GB·hour) get enough digits to stay
// meaningful instead of collapsing to "Rp 4" or "$0".
function formatIdr(idr: number): string {
  if (idr === 0) return fmt('id-ID', 'IDR', 0).format(0);
  // Fractional rupiah on rate cards — show 2 decimals.
  if (Math.abs(idr) < 100 && idr % 1 !== 0) return fmt('id-ID', 'IDR', 2).format(idr);
  return fmt('id-ID', 'IDR', 0).format(idr);
}

function formatUsd(cents: number): string {
  const dollars = cents / 100;
  if (dollars === 0) return fmt('en-US', 'USD', 0).format(0);
  // Micro-amounts (< 1¢) like storage per-GB-hour need 4 decimals.
  if (Math.abs(dollars) < 0.01) return fmt('en-US', 'USD', 4).format(dollars);
  // Sub-dollar or fractional-dollar amounts: 2 decimals.
  if (Math.abs(dollars) < 1 || cents % 100 !== 0) return fmt('en-US', 'USD', 2).format(dollars);
  // Whole-dollar amounts: clean integer.
  return fmt('en-US', 'USD', 0).format(dollars);
}

/**
 * Locale-aware price display.
 *
 * Renders the IDR amount for Indonesian visitors, the USD amount for
 * everyone else. Reads its currency from useLocale() unless explicitly
 * overridden via `forceCurrency`.
 *
 * Server-render shows IDR (matches the Indonesian-first default). On
 * the client, useLocale() may flip the rendering to USD for non-ID
 * visitors after the geo probe resolves — that's a one-time swap per
 * session, then cached.
 *
 * Example:
 *   <Price idr={99000} usdCents={700} per="/mo" />
 *     → ID visitor:        "Rp 99.000/mo"
 *     → non-ID visitor:    "$7/mo"
 */
export function Price({
  idr,
  usdCents,
  per = '',
  forceCurrency,
  className,
}: PriceProps): ReactElement {
  const { currency } = useLocale();
  const active = forceCurrency ?? currency;
  const text = active === 'USD' ? formatUsd(usdCents) : formatIdr(idr);
  return (
    <span className={className}>
      {text}
      {per}
    </span>
  );
}
