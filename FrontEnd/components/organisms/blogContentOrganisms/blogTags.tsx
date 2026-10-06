import React from 'react';

import Link from 'next/link';

import { IProps } from './type';

export async function BlogTags({ ...props }: IProps) {
  const { blog, locale } = props;
  const isRTL = locale == "fa";
  return (
    <div className="flex flex-wrap gap-2">
      {blog?.blogTags?.map((tag,idx) => (
        <Link
        href={`/${locale}/tags/${tag.name}`}
        key={idx}
          className="cursor-pointer luca-chip"
        >
            #{tag.name}
        </Link>
      ))}
    </div>
  );
}
