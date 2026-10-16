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
    </div>
  );
}
