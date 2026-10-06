import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { IBlog } from '@models/Blog';

function formatBlogDate(value: Date | string | null | undefined, locale: string) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export async function BlogCard({ blog }: { blog: IBlog }) {
  const locale = await getLocale();
  const t = await getTranslations('blog');
  const isRtl = locale === 'fa';

  const title = (isRtl ? blog.titleFa : blog.titleEn) || blog.titleFa || blog.titleEn;
  const excerpt =
    (isRtl ? blog.excerptFa : blog.excerptEn) ||
    blog.excerptFa ||
    blog.excerptEn ||
    '';
  const dateLabel = formatBlogDate(blog.updatedAt || blog.createdAt, locale);
  const hasThumbnail = Boolean(blog.thumbnailFile?.trim());

  return (
    <Link
      href={`/${locale}/blog/${blog.slug}`}
      className="group flex flex-col gap-3.5 min-w-0 h-full text-start"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden luca-ph">
        {hasThumbnail ? (
          <MediaImage
            src={blog.thumbnailFile}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex justify-center items-center text-xs luca-muted">
            {t('title')}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 items-start gap-1.5">
        {dateLabel ? (
          <time className="text-xs luca-muted" dateTime={String(blog.updatedAt || blog.createdAt)}>
            {dateLabel}
          </time>
        ) : null}

        <h2 className="line-clamp-2 luca-h3">{title}</h2>

        {excerpt ? (
          <p className="text-sm line-clamp-2 leading-loose luca-muted">{excerpt}</p>
        ) : null}

        <div className="flex flex-wrap justify-between items-center gap-3 mt-auto w-full">
          <span className="text-[13px] underline underline-offset-[6px]">
            {t('readMore')}
          </span>
          {blog.authorName ? (
            <span className="text-xs truncate luca-muted">{blog.authorName}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
