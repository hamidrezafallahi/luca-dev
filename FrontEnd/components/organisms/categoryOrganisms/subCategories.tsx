import React from 'react';

import { getTranslations } from 'next-intl/server';

import CategoryCard from '@components/molecules/categoryCart';
import { ICategory } from '@models/category';

export async function SubCategories({ sub }: { sub?: ICategory[] }) {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-8">
      <div className="luca-h2">
        {t("category.subCategories")}
      </div>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-6 md:gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sub && sub.length > 0 ? (
          sub.map((c, idx) => <CategoryCard category={c} key={idx} />)
        ) : (
          <div>{t("category.noSubCategory")}</div>
        )}
      </div>
    </div>
  );
}
