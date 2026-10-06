import React from 'react';

import BrandCard from '@components/molecules/brandCard';
import { IBrand } from '@models/brand';

export async function BrandsCards({ brands }: { brands: IBrand[] }) {
 
 
  return (
    <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-7 md:gap-y-10 lg:gap-y-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {brands.map((b,idx) => (<BrandCard brand={b} key={idx}/>))}
    </div>
  );
}
