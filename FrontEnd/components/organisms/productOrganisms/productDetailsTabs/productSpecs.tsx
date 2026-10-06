import { getTranslations } from 'next-intl/server';

import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';
import { ISpecificationResponse } from '@models/product';

export default async function ProductSpecs({ id }: { id: number }) {
  const t = await getTranslations();
  const result = await safeFetchJson<SimpleResponse<ISpecificationResponse>>(
    `${serverApiBaseUrl}/Products/getSpecifications/${id}`,
    { next: { revalidate: 36 } },
  );
  const specs =
    result.ok && result.data?.isSuccess !== false ? result.data?.data : null;

  if (!specs || !specs.specifications?.length) {
    return <p className="text-sm luca-muted">{t('product.noSpecs')}</p>;
  }

  return (
    <ul className="gap-x-12 grid grid-cols-2 md:grid-cols-3 m-0 p-0 list-none">
      {specs.specifications.map((s, i) => (
        <li
          key={i}
          className="flex flex-col gap-1 py-4 border-[#c9c9c4] border-t"
        >
          <span className="text-[13px] luca-muted">{s.key}</span>
          <span className="text-[17px]">{s.value}</span>
        </li>
      ))}
    </ul>
  );
}
