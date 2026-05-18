'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from './types';

interface Props {
  entries: TocEntry[];
}

/**
 * Right-rail "On this page" navigator with scroll-spy.
 *
 * Uses IntersectionObserver to track which heading is currently in the
 * viewport's top band and highlights the matching TOC entry. Falls back
 * to the last heading above the viewport when nothing is in view so the
 * TOC never blanks at the bottom of a long page.
 *
 * rootMargin tuned to `0 0 -65% 0` — heading becomes active when it
 * enters the top 35% of the viewport. That feels natural for reading
 * speed without ping-ponging at chapter boundaries.
 */
export function DocsToc({ entries }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;
    const targets = entries
      .map((e) => document.getElementById(e.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (mutations) => {
        for (const m of mutations) {
          const id = m.target.id;
          if (m.isIntersecting) {
            visible.set(id, m.boundingClientRect.top);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size > 0) {
          const topmost = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActive(topmost);
          return;
        }
        let lastAbove: string | null = null;
        for (const target of targets) {
          if (target.getBoundingClientRect().top < 100) {
            lastAbove = target.id;
          }
        }
        if (lastAbove) setActive(lastAbove);
      },
      { rootMargin: '0px 0px -65% 0px', threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1.5">
        {entries.map((entry) => {
          const isActive = active === entry.slug;
          return (
            <li key={entry.slug} className={entry.depth === 3 ? 'pl-3' : ''}>
              <a
                href={`#${entry.slug}`}
                className={
                  isActive
                    ? 'block border-l-2 border-primary pl-2 text-xs font-medium leading-snug text-foreground transition-colors -ml-[2px]'
                    : 'block border-l-2 border-transparent pl-2 text-xs leading-snug text-muted-foreground transition-colors hover:text-foreground -ml-[2px]'
                }
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
