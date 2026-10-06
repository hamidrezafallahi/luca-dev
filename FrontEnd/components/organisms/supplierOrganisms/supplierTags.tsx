import React from 'react';

import { getLocale } from 'next-intl/server';

import TagCard from '@components/molecules/tagCard';
import { ITag } from '@models/tag';

export async function SupplierTags(props: { tags: ITag[][] }) {
  const { tags } = props;
  const locale = await getLocale();
  const flattenTags: ITag[] = [];
  tags.forEach((ts) => {
    ts.forEach((t) => {
      if (!flattenTags.some((ft) => ft.id == t.id)) {
        flattenTags.push(t);
      }
    });
  });
  return (
    <div className="flex flex-wrap gap-2 w-full [&>a]:w-auto">
      {flattenTags.map((t,i) => (<TagCard tag={t} key={i}/>
        
      ))}
    </div>
  );
}
