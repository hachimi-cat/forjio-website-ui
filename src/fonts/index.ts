import localFont from 'next/font/local';

/**
 * Gellix — the Forjio family display face. Used for marketing-site
 * headings only (the `.marketing-site :is(h1...h6)` rule in
 * `@forjio/website-ui/styles/marketing.css`).
 *
 * Wire it once in `app/layout.tsx`:
 *
 * ```tsx
 * import { gellix } from '@forjio/website-ui/fonts';
 *
 * <body className={`${inter.variable} ${jetbrainsMono.variable} ${gellix.variable} font-sans`}>
 * ```
 *
 * The `--font-display` CSS var is then consumed by both `marketing.css`
 * (above) and each product's `tailwind.config` (`fontFamily.display`).
 *
 * NB: `next/font/local` resolves paths at build time against THIS file's
 * location, so the .woff2 binaries must ship inside the package and sit
 * adjacent to this module — `dist/fonts/*.woff2` post-build. Don't move.
 */
export const gellix = localFont({
  src: [
    { path: './Gellix-Regular.woff2', weight: '400' },
    { path: './Gellix-Medium.woff2', weight: '500' },
    { path: './Gellix-SemiBold.woff2', weight: '600' },
    { path: './Gellix-Bold.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-display',
});
