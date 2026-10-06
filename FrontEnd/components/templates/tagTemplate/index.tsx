import React from 'react';

import { RelatedProductByTag } from '@components/organisms/tagOrganisms';
import { ITag } from '@models/tag';

export default function TagTemplate({
  Tag,
}: {
  Tag: ITag;
}) {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <header className="flex flex-col items-center gap-2.5 py-4 md:py-8 text-center">
        <h1 className="luca-h1">
          <span aria-hidden># </span>
          {Tag.name}
        </h1>
      </header>
      <RelatedProductByTag tagId={Tag.id} />
    </div>
  );
}
