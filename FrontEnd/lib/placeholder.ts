/**
 * Copy that still holds a template placeholder such as "[مدت و شرایط گارانتی]".
 * Blocks built from such copy stay hidden until the owner supplies the real text
 * in messages/*.json, so placeholders never reach users or crawlers.
 */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || /\[[^\]]+\]/.test(value);
}
