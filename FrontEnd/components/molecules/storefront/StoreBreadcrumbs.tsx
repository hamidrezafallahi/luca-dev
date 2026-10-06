import Link from 'next/link';

import JsonLd from '@components/molecules/storefront/JsonLd';
import { absoluteUrl } from '@lib/seo';

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

type Props = {
  locale: string;
  items: BreadcrumbItem[];
};

export default function StoreBreadcrumbs({ locale, items }: Props) {
  const crumbs = items.filter((item) => Boolean(item.name?.trim()));
  if (!crumbs.length) return null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path != null ? absoluteUrl(locale, item.path) : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <nav aria-label="Breadcrumb" className="overflow-x-auto">
        <ol className="flex min-w-max items-center gap-2.5 min-h-[52px] text-[13px] text-mute">
          {crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-2.5">
                {index > 0 && <span className="text-[#8a8a85]" aria-hidden>/</span>}
                {isLast || item.path == null ? (
                  <span className="max-w-[14rem] truncate text-ink" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={`/${locale}${item.path ? `/${item.path}` : ''}`}
                    className="inline-flex items-center max-w-[14rem] min-h-[44px] truncate hover:text-ink hover:underline underline-offset-4"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
