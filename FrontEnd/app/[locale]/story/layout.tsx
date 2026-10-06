import React, { ReactNode } from 'react';

import Footer from '@layout/footer';
import Header from '@layout/header';

function StoryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-[70vh]">{children}</div>
      <Footer />
    </>
  );
}

export default StoryLayout;
