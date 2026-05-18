// Layout primitives (the .marketing-site shell)
export { MarketingShell } from './MarketingShell';
export { MarketingNav } from './MarketingNav';
export { MarketingFooter } from './MarketingFooter';

// Marketing copy primitives
export { HeroBadge } from './HeroBadge';
export { SectionEyebrow } from './SectionEyebrow';

// Docs scaffolding (the right rail, sidebar, cross-product strip, search)
export { DocsToc } from './docs/DocsToc';
export { DocsSidebar } from './docs/DocsSidebar';
export { DocsMobileSidebar } from './docs/DocsMobileSidebar';
export { DocsSearch } from './docs/DocsSearch';
export { CrossProductNav } from './docs/CrossProductNav';

// Public types so consumers can build their own `groups` / `entries` /
// `index` arrays without re-declaring shapes locally.
export type { NavLink, FooterColumn, MarketingNavProps, MarketingFooterProps } from './types';
export type { TocEntry, DocItem, DocGroup, SearchEntry } from './docs/types';
export type { CrossProduct, CrossProductNavProps } from './docs/CrossProductNav';
