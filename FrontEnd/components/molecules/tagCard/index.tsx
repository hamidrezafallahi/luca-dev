import React from 'react';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import { ITag } from '@models/tag';

export default function TagCard({ tag }: { tag: ITag }) {
  const locale = useLocale();
  return (
    <Link href={`/${locale}/tags/${tag.slug || tag.id}`} className="w-full luca-chip">
      <span aria-hidden>#</span> {tag.name}
    </Link>
  );
}
