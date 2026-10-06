import React from 'react';

import MediaImage from '@components/atoms/MediaImage';

export function Banner({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  return (
    <div className="relative w-full h-56 md:h-[420px] overflow-hidden luca-ph">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-10`}
      >
        <MediaImage src={src} alt={name} fill className="object-cover" priority />
      </div>
    </div>
  );
}
