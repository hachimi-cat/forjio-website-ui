'use client';

import { useEffect, useState } from 'react';

/**
 * Locale resolved for the current visitor.
 *
 * Derived from a single source signal — Cloudflare's edge-injected
 * country code at `/cdn-cgi/trace`. Same hook drives currency display
 * today and language switching tomorrow.
 *
 * `country`  ISO 3166-1 alpha-2, uppercase. `null` while resolving;
 *            `'XX'` if we can't determine geo.
 * `currency` `'IDR'` for Indonesia, `'USD'` for everyone else. Defaults
 *            to `'IDR'` during the resolving phase to match the
 *            statically-rendered first paint on Indonesian-first sites.
 * `lang`     `'id'` for Indonesia, `'en'` otherwise. (Wired for future
 *            translation work; no translations land in this version.)
 * `resolved` `false` while the geo fetch is in flight; `true` once
 *            the values above are final for this session.
 */
export interface Locale {
  country: string | null;
  currency: 'IDR' | 'USD';
  lang: 'en' | 'id';
  resolved: boolean;
}

const SESSION_KEY = 'forjio.locale.country.v1';

function deriveCurrency(country: string | null): 'IDR' | 'USD' {
  return country === 'ID' ? 'IDR' : 'USD';
}

function deriveLang(country: string | null): 'en' | 'id' {
  return country === 'ID' ? 'id' : 'en';
}

let inFlight: Promise<string> | null = null;

async function resolveCountry(): Promise<string> {
  // sessionStorage cache so repeat navigations within the same tab
  // skip the network round-trip.
  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) return cached;
  } catch {
    // sessionStorage can throw in incognito-like modes; fall through.
  }

  // Coalesce parallel callers into a single fetch.
  if (!inFlight) {
    inFlight = (async () => {
      try {
        const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
        if (!res.ok) return 'XX';
        const text = await res.text();
        const match = text.match(/^loc=([A-Z]{2})/m);
        return match?.[1] ?? 'XX';
      } catch {
        return 'XX';
      }
    })().then((c) => {
      try { sessionStorage.setItem(SESSION_KEY, c); } catch { /* ignore */ }
      inFlight = null;
      return c;
    });
  }
  return inFlight;
}

/**
 * Client-side locale hook. Server-renders as `{ resolved: false }` with
 * the IDR/id defaults so the first paint matches the Indonesian-first
 * default; once the hook resolves on the client, components re-render
 * with the actual currency / language for the visitor.
 *
 * Consumers should bias their static markup toward the IDR defaults
 * (no flicker for Indonesian visitors, brief swap-in for international).
 */
export function useLocale(): Locale {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolveCountry().then((c) => {
      if (!cancelled) setCountry(c);
    });
    return () => { cancelled = true; };
  }, []);

  if (country === null) {
    return { country: null, currency: 'IDR', lang: 'id', resolved: false };
  }
  return {
    country,
    currency: deriveCurrency(country),
    lang: deriveLang(country),
    resolved: true,
  };
}

/** Imperative override for the resolved country. Useful for a manual
 *  "View in: IDR / USD" toggle the user can flip from the footer or
 *  account menu. Writes through sessionStorage so it survives nav. */
export function setLocaleCountry(country: string): void {
  try { sessionStorage.setItem(SESSION_KEY, country.toUpperCase()); } catch { /* ignore */ }
  // Force a reload so every Price across the page re-reads. Cheaper
  // than wiring a pub/sub for a feature that fires once per visit.
  if (typeof window !== 'undefined') window.location.reload();
}
