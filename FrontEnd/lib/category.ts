import 'server-only';

import { PagedResponse } from '@models/base';
import {
  CategoryRequestQueries,
  ICategory,
} from '@models/category';

import { serverApiBaseUrl } from './api';
import { describeStatus, readApiResult } from './apiError';

const emptyCategoryQueries: CategoryRequestQueries['queries'] = {};

export async function getCategories(
  { queries }: CategoryRequestQueries = { queries: emptyCategoryQueries }
) {
  const { ByConfig, IsShowInLanding, Page, PageSize } = (await queries) || {};
  const params = new URLSearchParams();
  if (Page !== undefined) params.append("page", Page.toString());
  if (PageSize !== undefined) params.append("PageSize", PageSize.toString());
  if (ByConfig !== undefined) params.append("ByConfig", ByConfig.toString());
  if (IsShowInLanding !== undefined) params.append("IsShowInLanding", IsShowInLanding.toString());
  const url = `${serverApiBaseUrl}/Categories?${params.toString()}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60, tags: ['categories'] },
    });
    const result = await readApiResult<PagedResponse<ICategory>['data']>(res);
    if (!result.isSuccess) {
      console.error('getCategories failed', { url, status: res.status, error: result.error });
    }
    return result;
  } catch (error) {
    console.error('getCategories: no answer', { url }, error);
    return { isSuccess: false, data: null, error: describeStatus(503) };
  }
}

/**
 * Categories for the landing grid: the ones flagged "show in landing", or every
 * active root category when none is flagged, so the section is never empty
 * while categories exist.
 */
export async function getLandingCategories(): Promise<{
  categories: ICategory[];
  error: string | null;
}> {
  const flagged = await getCategories({ queries: { IsShowInLanding: true } });
  if (flagged.data?.records?.length) {
    return { categories: flagged.data.records, error: null };
  }

  const all = await getCategories({ queries: { PageSize: 8 } });
  return {
    categories: all.data?.records ?? [],
    error: all.isSuccess ? null : all.error,
  };
}
