import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import EmptyState from '@components/molecules/storefront/EmptyState';
import FaqAccordion from '@components/molecules/storefront/FaqAccordion';
import PageHeader from '@components/molecules/storefront/PageHeader';
import { getFaqs } from '@lib/faq';
import { buildPageMetadata } from '@lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

/** ISR: regenerate at most once per minute. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faqPage' });

  return buildPageMetadata({
    locale,
    path: 'faq',
    title: t('title'),
    description: t('description'),
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faqPage' });
  const faqs = await getFaqs();

  return (
    <article className="store-page !pt-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
        align="center"
      />

      {faqs.length === 0 ? (
        <EmptyState title={t('empty')} description={t('emptyHint')} />
      ) : (
        <FaqAccordion
          items={faqs}
          withJsonLd
          className="mx-auto w-full"
        />
      )}

      <div className="flex flex-col items-center gap-4 -mx-5 md:-mx-10 xl:-mx-16 -mb-16 md:-mb-24 px-5 py-14 md:py-16 text-center luca-tint">
        <h2 className="luca-h2">{t('contactTitle')}</h2>
        <p className="max-w-[440px] luca-muted">{t('contactHint')}</p>
        <Link
          href={`/${locale}/cooperation`}
          className="store-btn store-btn-primary"
        >
          {t('contactCta')}
        </Link>
      </div>
    </article>
  );
}
