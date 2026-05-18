/**
 * Mini className joiner — we deliberately avoid clsx/tailwind-merge to
 * keep the dependency footprint at zero runtime deps. Tailwind class
 * conflicts are not a concern inside our own components since we author
 * them; the consumer's twMerge still works fine on the result.
 */
export function cx(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}
