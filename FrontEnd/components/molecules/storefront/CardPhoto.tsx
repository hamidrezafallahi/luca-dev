'use client';

import { useState } from 'react';

import MediaImage from '@components/atoms/MediaImage';

/** The subject is already named by the card heading. */
export function CardPhotoPlaceholder() {
  return (
    <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-store-subtle">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="m20.5 16-5-5-8 8" />
      </svg>
    </span>
  );
}

type Props = {
  src?: string | null;
  sizes: string;
  position: string;
};

export default function CardPhoto({ src, sizes, position }: Props) {
  const image = src?.trim();
  const [failedImage, setFailedImage] = useState<string>();

  if (!image || image === 'null' || image === 'undefined' || image === failedImage) {
    return <CardPhotoPlaceholder />;
  }

  return (
    <MediaImage
      src={image}
      alt=""
      fill
      sizes={sizes}
      loading="lazy"
      style={{ objectPosition: position }}
      className="object-cover"
      onError={() => setFailedImage(image)}
    />
  );
}
