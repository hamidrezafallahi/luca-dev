import React from 'react';

import FaqSection from '@components/molecules/storefront/FaqSection';
import {
  ArticleContent,
  AuthorCard,
  BlogSidebar,
  BlogTags,
} from '@components/organisms/blogContentOrganisms';

import { IProps } from './type';

export async function BlogContent({ ...props }: IProps) {
  const { blog, locale, faqItems = [] } = props;
  const prop = { blog, locale };
  return (
    <div className="mx-auto py-6 md:py-10 w-full max-w-[1080px]">
      <div className="relative flex lg:flex-row-reverse flex-col-reverse gap-8 lg:gap-[72px]">
        <main className="flex flex-col flex-1 gap-6 min-w-0 max-w-[720px]">
          <AuthorCard {...prop} />
          <ArticleContent {...prop} />
          {faqItems.length > 0 ? (
            <FaqSection items={faqItems} locale={locale} />
          ) : null}
          <BlogTags {...prop} />
        </main>
        <BlogSidebar {...prop} />
      </div>
    </div>
  );
}
