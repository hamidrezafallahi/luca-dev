import React from 'react';

import {
  SupplierProducts,
  SupplierProfile,
} from '@components/organisms/supplierOrganisms';
import { IUser } from '@models/user';

export default async function SupplierTemplate({supplier}:{supplier:IUser}) {
  return (
       <div className="flex flex-col gap-12 md:gap-16 w-full">
        <SupplierProfile user={supplier}/>  
         <SupplierProducts id={supplier.id} />
        {/* <SupplierBrands id={supplier.id}  />
        <SupplierCategory id={supplier.id}/>
        <SupplierTags id={supplier.id}/>
        <SupplierCommentsAndRates  /> */}
    </div>
  )
}
