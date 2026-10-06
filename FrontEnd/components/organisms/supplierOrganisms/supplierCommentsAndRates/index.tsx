import React from 'react';

import { getTranslations } from 'next-intl/server';

import MediaImage from '@components/atoms/MediaImage';
import { StarIcon } from '@components/atoms/iconComponents';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';
import {
  EnumTargetType,
  IComment,
} from '@models/comment';

import CommentAndRate from './CommentAndRate';

export async function SupplierCommentsAndRates(props: {
  params: { slug: string; locale: string };
}) {
  const { params } = props;
  const slug = await params.slug;
  const t = await getTranslations();

  const result = await safeFetchJson<SimpleResponse<IComment[]>>(
    `${serverApiBaseUrl}/Comments/${EnumTargetType.Supplier}/${slug}`,
    { next: { revalidate: 36 } },
  );

  if (!result.ok || result.data?.isSuccess === false) {
    return <div>{t('common.supplierNotFound')}</div>;
  }

  const data = result.data?.data || [];
  return (
    <>
      <div className="gap-4 lg:gap-6 grid md:grid-cols-3">
        {data.map((comment) => (
          <div
            key={comment.id}
            className="p-6 border text-start luca-line"
          >
            <div className="flex items-center mb-3">
              <MediaImage
                src={comment.userImage}
                alt={comment.userFullName}
                width={50}
                height={50}
                className="rounded-full w-14 h-14"
              />
              <div className="ms-3">
                <h4 className="font-medium text-sm">{comment.userFullName}</h4>
                <div className="flex text-ink">
                  {Array.from({ length: comment.userRate }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm leading-loose luca-muted">
              {comment.content}
            </p>
            <time className="text-xs luca-muted">
              {new Date(comment.createdAt).toLocaleDateString()}
            </time>
          </div>
        ))}
      </div>
      <CommentAndRate TargetType={EnumTargetType.Supplier} TargetId={slug} />
    </>
  );
}
