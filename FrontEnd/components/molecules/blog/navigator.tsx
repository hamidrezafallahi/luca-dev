import React from 'react';

import { getTranslations } from 'next-intl/server';

export async function Navigator({ ...props }: IProps) {
  const {   locale } = props;

  const t = await getTranslations({ locale });
  const isRTL = locale == "fa";
  return (
    <div className="px-6 pt-5 pb-2 border luca-line text-start">
      <h3 className="pb-3 font-body font-semibold text-sm">
        {t("blog.tableOfContents")}
      </h3>
      <nav className="flex flex-col">
        <a
          href="#section1"
          className="flex items-center border-line border-t min-h-[44px] text-mute hover:text-ink text-sm"
        >
        {t("blog.introduction")}
        </a>
        <a
          href="#section2"
          className="flex items-center border-line border-t min-h-[44px] text-mute hover:text-ink text-sm"
          >
            {t("blog.content")}
 
        </a>
        <a
          href="#section3"
          className="flex items-center border-line border-t min-h-[44px] text-mute hover:text-ink text-sm"
          >
            {t("blog.conclusion")}
        </a>
      </nav>
    </div>
  );
}
