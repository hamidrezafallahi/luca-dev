import React from 'react';

import { getLandingProductsByTabs } from '@lib/landing';

import TheMostProductsClient from './theMostProductsClient';

export default async function TheMostProducts() {
  const { bestSeller, theNewest, discounters } = await getLandingProductsByTabs();

  return (
    <section className="store-section luca-container">
      <TheMostProductsClient
        bestSeller={bestSeller}
        theNewest={theNewest}
        discounters={discounters}
      />
    </section>
  );
}
