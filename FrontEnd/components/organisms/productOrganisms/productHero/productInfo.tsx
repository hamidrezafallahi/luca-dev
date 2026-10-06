import {
  getLocale,
  getTranslations,
} from 'next-intl/server';

import { IDetailedProduct } from '@models/product';

import ProductPrice from './productPrice';
import ProductRate from './productRate';

export default async function ProductInfo({ product }: { product: IDetailedProduct }) {
  const locale = await getLocale();
  const t = await getTranslations();

  const formatLength = (value: number) => {
    const unit = locale === 'en' ? 'inch' : 'centimeter';
    const converted = locale === 'en' ? value / 2.54 : value;
    return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short' }).format(converted);
  };

  const formatWeight = (value: number) => {
    const unit = locale === 'en' ? 'ounce' : 'gram';
    const converted = locale === 'en' ? value / 28.3495 : value;
    return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short' }).format(converted);
  };

  const specs: { label: string; value: string }[] = [];
  if (product.dimensions?.width) specs.push({ label: t('product.width'), value: formatLength(product.dimensions.width) });
  if (product.dimensions?.height) specs.push({ label: t('product.height'), value: formatLength(product.dimensions.height) });
  if (product.dimensions?.depth) specs.push({ label: t('product.depth'), value: formatLength(product.dimensions.depth) });
  if (product.dimensions?.weight) specs.push({ label: t('product.weight'), value: formatWeight(product.dimensions.weight) });

  return (
    <div className="flex flex-col gap-6 lg:pt-4 w-full max-w-[600px] lg:max-w-none text-start">
      <div className="flex flex-col gap-1.5">
        {(product.brandName || product.categoryName) && (
          <span className="luca-eyebrow">
            {[product.brandName, product.categoryName].filter(Boolean).join(' · ')}
          </span>
        )}
        <h1 className="luca-h2">{product.name}</h1>
      </div>

      <ProductPrice
        price={product.price}
        finalPrice={product.finalPrice}
        currency={product.currency}
        inStock={product.inStock}
        inventory={product.inventory}
        locale={locale}
      />

      {product.description && (
        <p className="text-[15px] line-clamp-4 leading-loose luca-muted">{product.description}</p>
      )}

      <ProductRate
        id={product.id}
        average={product.averageRate}
        count={product.rateCount}
      />

      <a href="#product-offers" className="w-full store-btn store-btn-primary">
        {t('product.chooseOffer')}
      </a>

      {specs.length > 0 && (
        <dl className="gap-x-6 grid grid-cols-2 m-0">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1 py-4 border-t luca-line">
              <dt className="text-[13px] luca-muted">{spec.label}</dt>
              <dd className="m-0 text-[17px]">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
