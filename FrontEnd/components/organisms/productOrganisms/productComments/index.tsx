"use client";

import {
  useLocale,
  useTranslations,
} from 'next-intl';

import { IComment } from '@models/comment';

export default function ProductComments({
  comments,
}: {
  comments: IComment[];
}) {
  const locale = useLocale();
  const t = useTranslations();
  return (
    <section className="flex flex-col">
      <h3 className="mb-2 luca-h3">{t('product.userReviews')}</h3>

      {comments.map((c: IComment) => (
        <article key={c.id} className="py-4 border-t luca-line">
          <p className="font-medium text-sm">{c.userFullName}</p>
          <p className="text-sm leading-loose luca-muted">{c.content}</p>
          <time className="text-xs luca-muted">
            {Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
              dateStyle: "full",
            }).format(new Date(c.createdAt))}
          </time>
        </article>
      ))}
    </section>
  );
}
