import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

import ProductCTA from './productCTA';

export interface ISupplier {
  id: number;
  productId: number;
  productName: string;
  supplierId: number;
  supplierSlug?: string | null;
  supplierName: string;
  supplierImage: string;
  supplierDesc: null | string;
  basePrice: number;
  finalPrice: number;
  inventory: number;
  isActive: true;
  createdAt: string;
  activeDiscounts: [];
}

export async function SupplierCardGrid({
  supplier,
  productId,
  locale,
}: {
  supplier: ISupplier;
  productId: number;
  locale: string;
}) {
  const t = await getTranslations();
  const inStock = supplier.inventory > 0;
  const hasDiscount = Array.isArray(supplier.activeDiscounts) && supplier.activeDiscounts.length > 0;
  const profileHref = `/${locale}/suppliers/${supplier.supplierSlug || supplier.supplierId}`;

  return (
    <article className="group relative flex flex-col border h-full luca-line">
      <div className="top-3 z-10 absolute flex flex-col items-start gap-1.5 start-3">
        {hasDiscount && (
          <span className="luca-badge luca-badge-accent">{t('common.specialDiscount')}</span>
        )}
        {!inStock && (
          <span className="luca-badge luca-badge-mute">{t('common.outOfStock')}</span>
        )}
      </div>

      <Link href={profileHref} className="block relative h-40 overflow-hidden luca-ph">
        <MediaImage
          alt={supplier.supplierName}
          src={supplier.supplierImage}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      <div className="flex flex-col flex-1 items-start gap-2 p-4 min-w-0 text-start">
        <Link href={profileHref} className="hover:underline underline-offset-4">
          <h3 className="font-body font-medium text-[15px] line-clamp-1">
            {supplier.supplierName}
          </h3>
        </Link>

        {supplier.supplierDesc ? (
          <p className="text-xs line-clamp-2 leading-5 luca-muted">
            {supplier.supplierDesc}
          </p>
        ) : null}

        {inStock ? <span className="luca-badge">{t('common.inStock')}</span> : null}

        <div className="flex flex-wrap items-baseline gap-1.5 mt-auto pt-2">
          <span className="text-lg">
            {supplier.finalPrice.toLocaleString('fa-IR')}
          </span>
          <span className="text-sm luca-muted">{t('common.currency')}</span>
        </div>

        <ProductCTA id={supplier.id} productId={productId} />
      </div>
    </article>
  );
}
