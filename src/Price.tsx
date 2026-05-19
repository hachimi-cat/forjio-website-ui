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

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

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
  const text = active === 'USD'
    ? usdFormatter.format(usdCents / 100)
    : idrFormatter.format(idr).replace(/\s/g, ' ');
  return (
    <span className={className}>
      {text}
      {per}
    </span>
  );
}
