import React, { ReactNode } from 'react';

import Footer from '@layout/footer';
import Header from '@layout/header';

/** Price-list sheets: storefront chrome around a centred stack of catalogue photos. */
function ExhibitionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="exhibit-root min-h-[70vh]">{children}</div>
      <Footer />
    </>
  );
}

export default ExhibitionLayout;
