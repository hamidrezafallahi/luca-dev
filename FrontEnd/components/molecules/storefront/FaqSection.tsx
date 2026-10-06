import { getTranslations } from 'next-intl/server';

import JsonLd from '@components/molecules/storefront/JsonLd';

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FaqItem[];
  locale: string;
  title?: string;
};

export function parseFaqJson(raw?: string | null): FaqItem[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        question: String(item?.question ?? item?.q ?? '').trim(),
        answer: String(item?.answer ?? item?.a ?? '').trim(),
      }))
      .filter((item) => item.question && item.answer);
  } catch {
    return [];
  }
}

export default async function FaqSection({ items, locale, title }: Props) {
  if (!items.length) return null;

  const t = await getTranslations('storefront');

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="flex flex-col items-center gap-8 py-12 md:py-20">
      <JsonLd data={faqLd} />
      <h2 className="luca-h2">{title || t('faqTitle')}</h2>
      <div className="flex flex-col border-b w-full max-w-[860px] luca-line">
        {items.map((item) => (
          <details key={item.question} className="group border-t text-start luca-line">
            <summary className="flex justify-between items-center gap-4 py-2 min-h-[64px] font-medium text-[15px] list-none cursor-pointer marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden
                className="text-2xl leading-none transition-transform group-open:rotate-45 shrink-0"
              >
                +
              </span>
            </summary>
            <p className="pb-6 text-[15px] leading-loose luca-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
