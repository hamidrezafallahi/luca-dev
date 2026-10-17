import { notFound } from 'next/navigation';

/**
 * Unknown paths under /fa or /en would otherwise fall through to the root
 * (Persian-only) app/not-found.tsx; route them to app/[locale]/not-found.tsx.
 */
export default function CatchAllNotFound() {
  notFound();
}
