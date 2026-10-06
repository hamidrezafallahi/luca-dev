import React from 'react';

import { getTranslations } from 'next-intl/server';

import { IProps } from './type';

export async function AuthorCard({ ...props }: IProps) {
  const { blog, locale } = props;
  const t = await getTranslations({ locale });
  const isRTL = locale == "fa";
  return (
    <div
      className={`flex items-center gap-4 p-5 border border-line ${
        isRTL ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="flex flex-shrink-0 justify-center items-center rounded-full w-[72px] h-[72px] text-mute luca-ph">
        <div className="text-xs">{t("blog.author")}</div>
      </div>
      <div>
        <h3>
          {blog.authorName}
        </h3>
        <div>{t("blog.createdAt")}</div>
        <time className="text-mute text-[13px]">
          {new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(blog.createdAt))}
        </time>
        <div>{t("blog.updatedAt")}</div>
        <time className="text-mute text-[13px]">
          {new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(blog.updatedAt))}
        </time>
      </div>
    </div>
  );
}
