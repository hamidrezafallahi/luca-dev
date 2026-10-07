import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ShoppingCartTemplate from '@components/templates/shoppingCartTemplate';
import Footer from '@layout/footer';
import Header from '@layout/header';
import { buildPageMetadata } from '@lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cartPage' });

  return buildPageMetadata({
    locale,
    path: 'shoppingCart',
    title: t('metaTitle'),
    description: t('metaDescription'),
    noIndex: true,
  });
}

export default async function ShoppingCartPage({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <ShoppingCartTemplate locale={locale} />
      <Footer />
    </>
  );
}
