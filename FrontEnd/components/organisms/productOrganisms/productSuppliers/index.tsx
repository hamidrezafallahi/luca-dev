import {
  getLocale,
  getTranslations,
} from 'next-intl/server';

import EntityGrid from '@components/molecules/storefront/EntityGrid';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';

import {
  ISupplier,
  SupplierCardGrid,
} from './supplierCard';

export async function ProductSupplierExtended({
  productId,
}: {
  productId: string | number;
}) {
  const result = await safeFetchJson<SimpleResponse<ISupplier[]>>(
    `${serverApiBaseUrl}/productOffers/by-product/${productId}`,
    { next: { revalidate: 36 } },
  );
  const suppliers =
    result.ok && result.data?.isSuccess !== false
      ? result.data?.data || []
      : [];
  const locale = await getLocale();
  const t = await getTranslations();
  if (suppliers.length === 0) return null;

  return (
    <section id="product-offers" className="flex flex-col gap-8 scroll-mt-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="luca-h2">{t('product.suppliersTitle')}</h2>
        <span className="luca-badge luca-badge-mute">
          {t('product.suppliersCount', { count: suppliers.length })}
        </span>
      </div>

      <EntityGrid cols="cards">
        {suppliers.map((supplier: ISupplier, index: number) => (
          <SupplierCardGrid
            key={supplier.id ?? index}
            supplier={supplier}
            productId={Number(productId)}
            locale={locale}
          />
        ))}
      </EntityGrid>
    </section>
  );
}
