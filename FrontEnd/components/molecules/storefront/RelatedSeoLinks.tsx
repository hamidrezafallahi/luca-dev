import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type LinkItem = {
  href: string;
  label: string;
};

type Props = {
  locale: string;
  title?: string;
  links: LinkItem[];
};

export default async function RelatedSeoLinks({ locale, title, links }: Props) {
  const t = await getTranslations('storefront');
  const items = links.filter((link) => link.href && link.label);
  if (!items.length) return null;

  return (
    <section className="flex flex-col gap-5 pt-10 border-t luca-line">
      <h2 className="luca-h3">
        {title || t('relatedLinks')}
      </h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="luca-chip"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
