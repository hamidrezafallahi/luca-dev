import React from 'react';

import { getTranslations } from 'next-intl/server';

export async function ShareButtons({ ...props }: IProps) {
  const {  locale } = props;
  const t = await getTranslations({locale});
  const isRTL = locale == "fa";
  return (
    <div className="flex flex-col gap-3 text-start">
      <h3 className="font-body font-normal text-mute text-sm">
        {t("blog.share")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {["twitter", "linkedin", "telegram", "whatsapp"].map((platform) => (
          <button
            key={platform}
            className="flex justify-center items-center border border-line hover:border-ink w-11 h-11 transition-colors"
            aria-label={`Share on ${platform}`}
          >
            {platform.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
