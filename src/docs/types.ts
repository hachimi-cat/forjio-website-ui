/**
 * TOC entry — depth-2 (h2) and depth-3 (h3) headings collected from a
 * rendered doc page. The slug must match the heading's anchor id so
 * `IntersectionObserver` can hand-off to the TOC scroll-spy.
 */
export type TocEntry = { depth: 2 | 3; text: string; slug: string };

export interface DocItem {
  href: string;
  title: string;
}

export interface DocGroup {
  heading: string;
  items: DocItem[];
}

/**
 * Flat full-text search index entry — one per docs page. The body is a
 * pre-stripped, length-capped plain-text dump of the markdown source.
 */
export interface SearchEntry {
  href: string;
  title: string;
  group: string;
  body: string;
}
