import React from 'react';

import MediaImage from '@components/atoms/MediaImage';

import { IProps } from './type';

export async function HeroSection({ ...props }: IProps) {
  const { blog, locale } = props;
  const isRTL = locale == "fa";
  const title = isRTL ? blog.titleFa : blog.titleEn;

  return (
    <section className="flex flex-col">
      <div className="flex flex-col justify-center items-center gap-3 px-0 pt-4 pb-10 min-h-[260px] text-center">
        <time className="luca-eyebrow">
          {new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(blog.createdAt))}
        </time>
        <h1 className="max-w-[860px] luca-h1">{title}</h1>
        <p className="max-w-[640px] line-clamp-2 leading-loose luca-muted">
          {isRTL ? blog.excerptFa : blog.excerptEn}
        </p>
      </div>

      {blog.thumbnailFile && (
        <div className="relative w-full h-[240px] md:h-[400px] xl:h-[520px] overflow-hidden luca-ph">
          <MediaImage
            src={blog.thumbnailFile}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}
    </section>
  );
}
