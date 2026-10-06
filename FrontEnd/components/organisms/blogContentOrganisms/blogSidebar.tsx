import React from 'react';

import {
  Navigator,
  ShareButtons,
} from '@components/molecules/blog';

export async function BlogSidebar({ ...props }: IProps) {
  const { locale } = props;
  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <div className="top-6 lg:sticky flex flex-col gap-6">
        <ShareButtons locale={locale} />
        <Navigator locale={locale}/>
      </div>
    </aside>
  );
}
