import React from 'react';

import { getLandingProductsByTabs } from '@lib/landing';

import TheMostProductsClient from './theMostProductsClient';
import ApiErrorNotice from '@components/molecules/apiErrorNotice';

export default async function TheMostProducts() {
  const { bestSeller, theNewest, discounters, error } = await getLandingProductsByTabs();

  // Nothing to show in any tab: drop the section rather than render an empty heading.
  if (!bestSeller.length && !theNewest.length && !discounters.length) {
    return error ? (
      <section className="store-section luca-container">
        <ApiErrorNotice message={error} />
      </section>
    ) : null;
  }

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
