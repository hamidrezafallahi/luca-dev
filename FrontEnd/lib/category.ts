import 'server-only';

import { PagedResponse } from '@models/base';
import {
  CategoryRequestQueries,
  ICategory,
} from '@models/category';

import { serverApiBaseUrl } from './api';

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
    if (!res.ok) {
      console.error('getCategories HTTP error', { url, status: res.status });
      return undefined;
    }
    const data: PagedResponse<ICategory> = await res.json();
    return data;

  } catch (error) {
    console.log(error)
  }
}

/**
 * Categories for the landing grid: the ones flagged "show in landing", or every
 * active root category when none is flagged, so the section is never empty
 * while categories exist.
 */
export async function getLandingCategories(): Promise<ICategory[]> {
  const flagged = await getCategories({ queries: { IsShowInLanding: true } });
  if (flagged?.data?.records?.length) return flagged.data.records;

  const all = await getCategories({ queries: { PageSize: 8 } });
  return all?.data?.records ?? [];
}
