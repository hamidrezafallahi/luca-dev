export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Picks the value for the current locale from a Persian/English pair coming
 * from the backend. Falls back to the other language when the preferred one is
 * empty, so /en never renders a blank label.
 */
export function pickLocalized(
  locale: string,
  fa?: string | null,
  en?: string | null
): string {
  const primary = locale === 'fa' ? fa : en;
  const secondary = locale === 'fa' ? en : fa;
  return primary?.trim() ? primary : secondary ?? '';
}
