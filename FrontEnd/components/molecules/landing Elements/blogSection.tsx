import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { getAll } from '@lib/getAll';
import { IBlog } from '@models/Blog';

function formatBlogDate(value: Date | string | null | undefined, locale: string) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default async function BlogSection() {
  const locale = await getLocale();
  const t = await getTranslations('blog');

  const response = await getAll<IBlog>('blogs', {
    page: 1,
    pageSize: 3,
    byConfig: false,
    onlyActives: true,
  });

  const posts = response?.data?.records ?? [];

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-10 store-section luca-container">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="luca-h2">{t('landingTitle')}</h2>
          <p className="text-sm luca-muted">{t('landingSubtitle')}</p>
        </div>
        <Link href={`/${locale}/blog`} className="luca-link">
          {t('viewAll')}
        </Link>
      </div>

      <div className="gap-x-4 lg:gap-x-6 gap-y-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const title = locale === 'fa' ? post.titleFa : post.titleEn;
          const excerpt = locale === 'fa' ? post.excerptFa : post.excerptEn;
          const dateLabel = formatBlogDate(
            post.updatedAt || post.createdAt,
            locale,
          );

          return (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex flex-col gap-3.5 text-start"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden luca-ph">
                <MediaImage
                  src={post.thumbnailFile}
                  alt={title || post.slug}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col flex-grow items-start gap-1.5">
                {dateLabel ? <span className="text-xs luca-muted">{dateLabel}</span> : null}
                <h3 className="line-clamp-2 luca-h3">{title}</h3>
                {excerpt ? (
                  <p className="text-sm line-clamp-2 leading-loose luca-muted">{excerpt}</p>
                ) : null}
                <div className="flex justify-between items-center gap-3 mt-auto w-full">
                  <span className="text-[13px] underline underline-offset-[6px]">{t('readMore')}</span>
                  {post.authorName ? (
                    <span className="text-xs truncate luca-muted">{post.authorName}</span>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
