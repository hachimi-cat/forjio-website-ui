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

/**
 * Resolve a country code from the browser without a network round-trip.
 *
 * Signal: `navigator.language` (and its `languages[]` fallback) returns
 * a BCP-47 tag like `id-ID`, `en-US`, `id`, `en`. We extract the region
 * subtag where present.
 *
 * Why not `/cdn-cgi/trace`: that was the original signal — Cloudflare's
 * edge-injected country. Two problems killed it: (1) on non-Cloudflare
 * staging environments the fetch 404s but adds a pending request that
 * blocks Playwright's `waitUntil: 'networkidle'` for 45s; (2) Apple's
 * Lockdown Mode + some adblockers block Cloudflare endpoints. Browser
 * locale is universally available, free, synchronous, and tracks user
 * preference (which is what we actually want for pricing display
 * anyway — an expat in Jakarta with en-US locale probably wants USD).
 */
function resolveCountryFromBrowser(): string {
  if (typeof navigator === 'undefined') return 'XX';
  const tags: string[] = [];
  if (navigator.language) tags.push(navigator.language);
  if (Array.isArray(navigator.languages)) tags.push(...navigator.languages);
  for (const tag of tags) {
    const region = tag.split('-')[1];
    if (region && /^[A-Z]{2}$/.test(region)) return region.toUpperCase();
  }
  // Fallback: bare `id` / `en` with no region. Treat `id` as Indonesia.
  if (tags.some((t) => t.toLowerCase().startsWith('id'))) return 'ID';
  return 'XX';
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
  // null = pre-hydration (SSR + first client render). Falls back to the
  // Indonesian-first defaults so SSR HTML matches first paint for
  // Indonesian visitors (zero flicker). useEffect resolves it on the
  // client immediately after hydration.
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    // sessionStorage override wins (used by setLocaleCountry below).
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) { setCountry(cached); return; }
    } catch {
      // sessionStorage can throw in incognito-like modes; fall through.
    }
    setCountry(resolveCountryFromBrowser());
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
