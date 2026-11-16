import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

/**
 * Shared pieces of the LUCA product cards (styles: "LUCA Card System" in globals.css).
 * No hooks here, so both server and client cards can render them.
 */

export type ProductCardVariant = 'editorial' | 'immersive';

/** Forward arrow of a card CTA; globals.css mirrors it in RTL. */
export function CardArrow() {
  return (
    <svg
      className="luca-card-arrow"
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Plus icon of the compact add-to-cart pill (reference card A's "Follow +"). */
export function CardPlus() {
  return (
    <svg
      className="luca-card-action-icon"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

type ImmersiveFeatureCardProps = {
  href: string;
  name: string;
  description?: string | null;
  image: string | null | undefined;
  /** CSS object-position of the photo, to keep the subject clear of the text. */
  imagePosition?: string;
  /** The photo's dominant dark tone; the gradient and scrim are drawn in it. */
  tint?: string;
  /** Small label above the title, e.g. the brand or category. */
  label?: string | null;
  /** Optional translucent pill at the end of the title row, e.g. the price. */
  pill?: React.ReactNode;
  /** Optional short spec pills under the description, e.g. the magnifications. */
  pills?: string[];
  ctaLabel: string;
  imageSizes?: string;
};

/**
 * Immersive feature card: edge-to-edge photo, text over a bottom gradient and an
 * ivory CTA. Reserved for deliberately featured products (lib/featuredProducts.ts).
 */
export function ImmersiveFeatureCard({
  href,
  name,
  description,
  image,
  imagePosition,
  tint,
  label,
  pill,
  pills,
  ctaLabel,
  imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px',
}: ImmersiveFeatureCardProps) {
  return (
    <article
      className="luca-card luca-card-immersive"
      style={tint ? ({ '--card-tint': tint } as React.CSSProperties) : undefined}
    >
      <div className="luca-card-media">
        {image && (
          <MediaImage
            src={image}
            alt={name}
            fill
            className="luca-card-img"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
            sizes={imageSizes}
            loading="lazy"
          />
        )}
      </div>
      <div className="luca-card-body">
        {label && <span className="luca-card-eyebrow">{label}</span>}
        <div className="luca-card-headline">
          <h3 className="luca-card-title">{name}</h3>
          {pill}
        </div>
        {description && <p className="luca-card-desc">{description}</p>}
        {pills && pills.length > 0 && (
          <ul className="luca-card-pills">
            {pills.map((value) => (
              <li key={value} className="luca-card-pill" dir="auto">
                {value}
              </li>
            ))}
          </ul>
        )}
        <div className="luca-card-foot">
          <Link href={href} className="luca-card-cta" aria-label={`${ctaLabel}: ${name}`}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
