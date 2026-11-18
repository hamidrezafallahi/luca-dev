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
      <div className="cat-grid">
        {sub && sub.length > 0 ? (
          sub.map((c, idx) => <CategoryCard category={c} key={idx} />)
        ) : (
          <div>{t("category.noSubCategory")}</div>
        )}
      </div>
    </div>
  );
}
