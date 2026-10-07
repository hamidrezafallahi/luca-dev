import { ReactNode } from 'react';

import Footer from '@layout/footer';
import Header from '@layout/header';
import { ClientOnlyPersistGate } from '@store/provider';

/** noindex flow that depends on persisted state: the screen renders on the client after rehydration. */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <ClientOnlyPersistGate>{children}</ClientOnlyPersistGate>
      <Footer />
    </>
  );
}
