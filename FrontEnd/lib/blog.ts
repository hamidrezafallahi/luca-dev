import 'server-only';

import { notFound } from 'next/navigation';

import { SimpleResponse } from '@models/base';
import { IBlog } from '@models/Blog';

import { requireAbsoluteUrl, serverApiBaseUrl } from './api';
import { logger } from './logger';

export async function getBlogBySlug({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const url = requireAbsoluteUrl(
    `${serverApiBaseUrl}/Blogs/${slug}`,
    'getBlogBySlug URL',
  );

  let res: Response;
  let response: SimpleResponse<IBlog> | null = null;
  try {
    res = await fetch(url, { next: { revalidate: 60, tags: ['blogs'] } });
    if (res.ok || res.status === 404) {
      response = await res.json();
    }
  } catch (err) {
    logger.error('getBlogBySlug failed', { scope: 'blog', source: 'server', url }, err);
    // Network/parse failure is a server error, not a missing article.
    throw err;
  }

  // notFound() must run outside try/catch: it works by throwing.
  if (res.status === 404 || !response?.isSuccess || !response.data) {
    if (res.ok || res.status === 404) {
      logger.warn('getBlogBySlug not found', {
        scope: 'blog',
        source: 'server',
        url,
        errorMessage: response?.error,
      });
      notFound();
    }
    logger.error('getBlogBySlug HTTP error', {
      scope: 'blog',
      source: 'server',
      url,
      status: res.status,
    });
    throw new Error(`Blog ${slug} could not be loaded (API status ${res.status})`);
  }

  return response.data;
}
