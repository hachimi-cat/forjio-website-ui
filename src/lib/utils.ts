import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names with conflict resolution.
 * The shadcn/ui standard helper — every `components/ui/*` file imports this.
 *
 * Note: the package keeps its own zero-dep `cx` joiner (see ../utils) for
 * the token-composed layout components. `cn` is used only by the shadcn
 * primitives in `components/ui/*`, where twMerge conflict-resolution is
 * needed so consumer className overrides win.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
