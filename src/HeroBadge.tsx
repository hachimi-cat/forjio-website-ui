import type { BrandIcon } from './types';

interface HeroBadgeProps {
  /** lucide-react icon component (e.g. `Link2`). */
  brandIcon: BrandIcon;
  /** Primary line (sentence-case, NOT uppercase). */
  primary: string;
  /** Secondary line shown after an em-dash separator. */
  secondary: string;
}

/**
 * The canonical hero badge — a pill above the H1 that names the product
 * category in two parts. Per the Forjio landing family rules, this is
 * the ONE eyebrow on the page that is sentence-case + NOT mono. The
 * in-page section eyebrows below the hero use `SectionEyebrow` instead.
 */
export function HeroBadge({ brandIcon: BrandIcon, primary, secondary }: HeroBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs">
      <BrandIcon className="size-3 text-primary" strokeWidth={1.5} />
      <span className="font-medium text-foreground">{primary}</span>
      <span className="text-muted-foreground">— {secondary}</span>
    </div>
  );
}
