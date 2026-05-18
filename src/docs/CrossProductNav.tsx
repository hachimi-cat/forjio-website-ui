import Link from 'next/link';

export interface CrossProduct {
  /** Display name (e.g. "LinkSnap"). */
  name: string;
  /** Either an absolute URL or an in-app href; rendered into Next's <Link>. */
  href: string;
  /** Short category tagline shown after the name (e.g. "Short URLs"). */
  tagline: string;
}

export interface CrossProductNavProps {
  /** Ordered list of sibling products. */
  products: CrossProduct[];
  /** The `name` of the product currently being viewed — used to flag the active pill. */
  current: string;
  /** Label shown at the start of the strip; defaults to "Forjio". */
  familyLabel?: string;
}

/**
 * Top-strip nav linking all Forjio family docs. Surfaced above the docs
 * header so a reader exploring one product can hop sideways into a
 * sibling. The current product gets the active pill style; everything
 * else is muted. Override `products` per consumer; the current page
 * passes its own `name` so we can flag it.
 */
export function CrossProductNav({
  products,
  current,
  familyLabel = 'Forjio',
}: CrossProductNavProps) {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground mr-2">
            {familyLabel}
          </span>
          {products.map((p) => {
            const isCurrent = p.name === current;
            return (
              <Link
                key={p.name}
                href={p.href}
                className={
                  'shrink-0 rounded px-2 py-1 transition ' +
                  (isCurrent
                    ? 'bg-background font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground')
                }
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p.name}
                <span className="ml-1.5 text-[10px] text-muted-foreground/60">{p.tagline}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
