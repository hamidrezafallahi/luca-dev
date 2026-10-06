// ProductDetailsTabs.tsx
import { getTranslations } from 'next-intl/server';

import { IDetailedProduct } from '@models/product';

import ProductComments from './productComments';
import ProductDetailsTabsClient from './productDetailsTabsClient';
import ProductSpecs from './productSpecs';

interface Props {
  product: IDetailedProduct;
}

export async function ProductDetailsTabs({ product }: Props) {
  const t = await getTranslations();
  return (
    <section
      className="luca-tint -mx-5 md:-mx-10 xl:-mx-16 px-5 md:px-10 xl:px-16 py-12 md:py-16"
      aria-labelledby="product-tabs"
    >
      <h2 id="product-tabs" className="sr-only">
        {t('product.productDetails')}
      </h2>

      <ProductDetailsTabsClient>
        {/* desc */}
        <article className="max-w-[820px] text-[15px] leading-loose">
          {product.description}
        </article>
        {/* specs */}
        <ProductSpecs id={product.id} />

        {/* comments */}
        <ProductComments   id={product.id} />
      </ProductDetailsTabsClient>
    </section>
  );
}
