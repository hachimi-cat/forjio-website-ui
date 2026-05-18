# @forjio/website-ui

Shared marketing-site chrome for the Forjio family of SaaS products. Linksnap is the canonical anchor — every component in this package is extracted **from** the linksnap implementation, not invented.

Use it everywhere you'd previously copy-paste a `navbar.tsx` / `footer.tsx` / `docs/toc.tsx` between products.

```bash
npm install @forjio/website-ui
```

## What's in the box

| Export | Purpose |
|---|---|
| `MarketingShell` | The `.marketing-site` flex column wrapper for `app/(marketing)/layout.tsx`. |
| `MarketingNav` | Top navbar with brandmark + 3 nav links + login/CTA pair. Mobile drawer included. |
| `MarketingFooter` | 4-col footer (brand + Product/Company/Legal) with locked PT Forjio entity block. |
| `HeroBadge` | Sentence-case pill above the H1 (brand icon + primary line + secondary tagline). |
| `SectionEyebrow` | Mono uppercase eyebrow above each marketing section (Features, Pricing, etc). |
| `DocsToc` | Right-rail "On this page" scroll-spy. IntersectionObserver-based. |
| `DocsSidebar` | Left-rail collapsible doc sections; persists open state in localStorage. |
| `DocsMobileSidebar` | Mobile drawer triggered from the docs header. |
| `DocsSearch` | Client-side fuzzy search with ⌘K shortcut. |
| `CrossProductNav` | Top strip linking sibling Forjio products from inside a docs page. |
| `gellix` (from `/fonts`) | Pre-configured `next/font/local` instance for the Forjio display face. |
| `styles/marketing.css` | The `.marketing-site :is(h1...h6) { font-family: var(--font-display)... }` rule. |

## Wiring it up

### 1. Tailwind: scan the package dist

Each consumer's `tailwind.config.ts` must scan the package's compiled output so utility classes used inside the components are extracted into the final CSS bundle:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@forjio/website-ui/dist/**/*.js',
  ],
  theme: { /* ...your usual extend */ },
};

export default config;
```

If you forget this step, the package will render unstyled.

### 2. CSS vars: ensure the theme tokens exist

Every component reads colors via CSS vars (`--primary`, `--foreground`, `--border`, `--background`, `--card`, `--muted-foreground`, `--ring`, etc.). Your existing shadcn-style `globals.css` already provides these — no change needed. To recolor per product, override the vars (don't fork the components).

### 3. Fonts: import the Gellix helper once

In your `app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';
import { gellix } from '@forjio/website-ui/fonts';
import '@forjio/website-ui/styles/marketing.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${gellix.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

Then delete your in-repo `public/fonts/Gellix-*.woff2` files — they're served from the package now.

### 4. Marketing layout

In `app/(marketing)/layout.tsx`:

```tsx
import { Link2 } from 'lucide-react';
import { MarketingShell, MarketingNav, MarketingFooter } from '@forjio/website-ui';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingShell>
      <MarketingNav
        brandIcon={<Link2 className="h-6 w-6 text-primary" />}
        brandName="LinkSnap"
      />
      <main className="flex-1">{children}</main>
      <MarketingFooter
        brandIcon={<Link2 className="h-5 w-5 text-primary" />}
        brandName="LinkSnap"
        brandTagline="URL shortener and branded QR codes — part of the Forjio family."
      />
    </MarketingShell>
  );
}
```

### 5. Hero badge + section eyebrow in page bodies

```tsx
import { Link2 } from 'lucide-react';
import { HeroBadge, SectionEyebrow } from '@forjio/website-ui';

<HeroBadge
  brandIcon={<Link2 className="size-3 text-primary" strokeWidth={1.5} />}
  primary="Short links"
  secondary="Forjio family, branded QR included"
/>

<SectionEyebrow>Features</SectionEyebrow>
```

Locked convention: hero badge = sentence-case + NO mono / NO tracking. Section eyebrow = mono + uppercase + tracking-wider. Don't mix them.

### 6. Docs scaffold

In `app/(marketing)/docs/[[...slug]]/page.tsx`:

```tsx
import {
  CrossProductNav,
  DocsSearch,
  DocsMobileSidebar,
  DocsSidebar,
  DocsToc,
} from '@forjio/website-ui';

const FORJIO_PRODUCTS = [
  { name: 'Huudis',     href: 'https://huudis.com/docs',     tagline: 'Identity' },
  { name: 'Plugipay',   href: 'https://plugipay.com/docs',   tagline: 'Payments' },
  { name: 'Storlaunch', href: 'https://storlaunch.com/docs', tagline: 'E-commerce' },
  { name: 'Fulkruma',   href: 'https://fulkruma.com',        tagline: 'Fulfilment' },
  { name: 'Ripllo',     href: 'https://ripllo.com',          tagline: 'Marketing' },
  { name: 'LinkSnap',   href: '/docs',                       tagline: 'Short URLs' },
  { name: 'Pawpado',    href: 'https://pawpado.com',         tagline: 'GPU streaming' },
];

<CrossProductNav products={FORJIO_PRODUCTS} current="LinkSnap" />
<DocsSearch index={searchIndex} />
<DocsMobileSidebar groups={groups} currentHref={currentHref} />
<DocsSidebar groups={groups} currentHref={currentHref} />
<DocsToc entries={toc} />
```

The `groups`, `searchIndex`, and `toc` arrays come from your own markdown loader. Their shapes are exported as types:

```ts
import type { TocEntry, DocGroup, SearchEntry } from '@forjio/website-ui';
```

## Per-product migration checklist (Session 2)

For each of the 7 remaining products (storlaunch, fulkruma, ripllo, plugipay, pawpado, huudis, catentio):

1. `cd <repo>/frontend && npm install @forjio/website-ui`
2. Add `'./node_modules/@forjio/website-ui/dist/**/*.js'` to `tailwind.config.ts` → `content`.
3. In `app/layout.tsx`:
   - Delete the local `localFont({...Gellix...})` block.
   - `import { gellix } from '@forjio/website-ui/fonts';`
   - `import '@forjio/website-ui/styles/marketing.css';`
   - Add `${gellix.variable}` to `<body className>`.
4. Delete `public/fonts/Gellix-*.woff2` (4 files).
5. In `app/globals.css`: delete the `.marketing-site :is(h1...h6) { font-family: ... }` rule. The package CSS provides it now.
6. Replace `src/components/layout/navbar.tsx` usage in `(marketing)/layout.tsx` with `<MarketingNav brandIcon={<MyIcon className="h-6 w-6 text-primary" />} brandName="..." />` from the package, then delete `navbar.tsx`. Note `brandIcon` takes a pre-rendered ReactNode, not a component reference.
7. Same for `footer.tsx` → `<MarketingFooter brandIcon={<MyIcon className="h-5 w-5 text-primary" />} brandName="..." brandTagline="..." />`.
8. Replace the `(marketing)/layout.tsx` `<div className="marketing-site flex min-h-screen flex-col">` wrapper with `<MarketingShell>`.
9. Also migrate `(auth)/layout.tsx` if it shares the same chrome (most products do — see linksnap as the reference). It does NOT use `MarketingShell` (no Gellix headings on login/signup pages by convention).
10. In every `(marketing)/page.tsx`-style file:
    - Replace hand-rolled hero badge divs with `<HeroBadge brandIcon={<MyIcon className="size-3 text-primary" strokeWidth={1.5} />} primary="..." secondary="..." />`.
    - Replace `<p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">X</p>` with `<SectionEyebrow>X</SectionEyebrow>`.
11. If the product ships docs: replace `src/components/docs/{toc,sidebar,mobile-sidebar,search,cross-product-nav}.tsx` imports with the package equivalents, then delete those files. Keep your local `lib/markdown.tsx` (it's product-specific content) but re-export its `TocEntry` / `SearchEntry` shapes from `@forjio/website-ui` if you want to drop the local copy. `CrossProductNav` now takes a `products={...}` array and `current="..."` prop — the consumer owns the family list.
12. Delete any pre-existing `navbar.test.tsx` / `footer.test.tsx` under `__tests__/`. They were asserting against the OLD per-product copy and are dead weight now that the chrome lives in the shared package (the package will get its own tests in Session 3).
13. `npm run build && npm run typecheck` — fix import errors, deploy, screenshot-compare against the pre-migration baseline.

Per-product axes (the only things that should differ between consumers):
- `brandIcon` (lucide icon)
- `brandName` (wordmark string)
- `brandTagline` (footer one-liner)
- CSS var values in `globals.css` (especially `--primary`)
- Hero `primary` / `secondary` strings
- The `FORJIO_PRODUCTS` array's `current` key

Everything else — link sets, layout, address block, copyright — uses the locked defaults. Override only with cause.

## API decisions worth knowing

- **Defaults vs required.** `brandIcon` + `brandName` are required on `MarketingNav`, `MarketingFooter`, and `HeroBadge`. Everything else is defaulted. `navLinks`, `columns`, `company`, `copyrightSuffix` only need passing if you genuinely deviate from the linksnap canon.
- **`brandIcon` is `ReactNode`, not a component.** You pass `<Link2 className="..." />` — already rendered — not `Link2`. This is forced by Next App Router: function references can't cross the Server -> Client boundary, and `MarketingNav` is a Client Component (uses `useState` for the mobile drawer). The same constraint applies to `MarketingFooter` and `HeroBadge` for API symmetry. Canonical classes per slot: nav = `h-6 w-6 text-primary`, footer = `h-5 w-5 text-primary`, hero badge = `size-3 text-primary` with `strokeWidth={1.5}`.
- **`rightSlot` on `MarketingNav`.** Some products (huudis admin portal) want a single "Open dashboard" button instead of the login + CTA pair — pass your own ReactNode through `rightSlot` to replace the whole right cluster.
- **`loginHref: null` hides the log-in link.** Useful when the only entry is the CTA.
- **No theming prop.** Color comes from CSS vars only. Forking `MarketingNav` to recolor it is a smell — set `--primary` in your `globals.css` instead.
- **`CrossProductNav` is data-only.** We don't bake the product list into the package — each consumer passes its own `products` array. This lets a product's docs link to the *staging* docs of a sibling during a coordinated rollout without forking the package.
- **`storageKey` on `DocsSidebar`.** Defaults to a single shared key (`docs-sidebar-open-groups`) so a reader's preferences carry across products. Pass a product-scoped key only if you intentionally want isolation.

## Versioning

This package is **0.1.0** — pre-1.0 because the API will iterate as we migrate the remaining 7 products in Session 2. Pin to an exact version (`"@forjio/website-ui": "0.1.0"`) until 1.0 ships.

## Repo

- Source: https://github.com/hachimi-cat/forjio-website-ui
- Issues / changes: open a PR there.
