import React from 'react';

import JsonLd from '@components/molecules/storefront/JsonLd';

export type FaqAccordionItem = {
  id: number | string;
  question: string;
  answer: string;
};

type Props = {
  items: FaqAccordionItem[];
  /** Emit schema.org FAQPage JSON-LD (use on one page only to avoid duplicates). */
  withJsonLd?: boolean;
  className?: string;
};

/**
 * Theme-aware FAQ list (question/answer) built on native <details>,
 * so it works without client-side JavaScript and stays SSG/ISR friendly.
 */
export default function FaqAccordion({
  items,
  withJsonLd = false,
  className = '',
}: Props) {
  if (!items.length) return null;

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
    <div className={`flex flex-col border-b luca-line mx-auto w-full max-w-[860px] ${className}`}>
      {withJsonLd ? <JsonLd data={faqLd} /> : null}
      {items.map((item) => (
        <details key={item.id} className="group border-t text-start luca-line">
          <summary className="flex justify-between items-center gap-4 py-2 min-h-[64px] font-medium text-[15px] list-none cursor-pointer marker:content-none [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden
              className="text-2xl leading-none transition-transform group-open:rotate-45 shrink-0"
            >
              +
            </span>
          </summary>
          <p className="pb-6 text-[15px] leading-loose whitespace-pre-line luca-muted">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
