import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = {
  title?: string | null;
  description?: string | null;
  locale: string;
};

export default async function SeoHighlight({ title, description, locale }: Props) {
  if (!title && !description) return null;

  const t = await getTranslations('storefront');

  return (
    <aside className="px-6 py-5 text-start luca-tint">
      <p className="mb-1 luca-eyebrow">
        {t('seoSummary')}
      </p>
      {title ? <h2 className="luca-h3">{title}</h2> : null}
      {description ? (
        <p className="mt-1 text-sm leading-loose luca-muted">{description}</p>
      ) : null}
    </aside>
  );
}

type ChipProps = {
  href: string;
  label: string;
};

export function SeoRelatedChip({ href, label }: ChipProps) {
  return (
    <Link
      href={href}
      className="luca-chip"
    >
      {label}
    </Link>
  );
}
