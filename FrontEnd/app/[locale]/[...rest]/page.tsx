import { notFound } from 'next/navigation';

/**
 * Unknown paths under /fa or /en would otherwise fall through to the root
 * (Persian-only) app/not-found.tsx; route them to app/[locale]/not-found.tsx.
 */
// Metadata resolves before the response status is sent; notFound() here makes
// the response a real 404 instead of a 200 page that shows the 404 content.
export async function generateMetadata(): Promise<never> {
  notFound();
}

export default function CatchAllNotFound() {
  notFound();
}
