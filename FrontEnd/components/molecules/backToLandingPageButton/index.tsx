import React from 'react';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import {
  ArrowLongLeft,
  ArrowLongRight,
} from '@components/atoms/iconComponents';

function BackToLandingPageButton() {
    const locale = useLocale()
  return (
         <Link
        className="store-icon-btn"
        href={`/${locale}`}
      >
           {locale == "fa"? <ArrowLongRight/>:<ArrowLongLeft/>}
      </Link>
  )
}

export default BackToLandingPageButton