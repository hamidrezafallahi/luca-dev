import React from 'react';

import { getLandingProductsByTabs } from '@lib/landing';

import TheMostProductsClient from './theMostProductsClient';

export default async function TheMostProducts() {
  const { bestSeller, theNewest, discounters } = await getLandingProductsByTabs();

  // Nothing to show in any tab: drop the section rather than render an empty heading.
  if (!bestSeller.length && !theNewest.length && !discounters.length) return null;

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
