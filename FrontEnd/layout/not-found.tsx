import React from "react";

import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("store");

  return (
    <div className="flex flex-col justify-center items-center gap-3.5 px-5 py-24 text-center">
      <span className="text-[120px] leading-none luca-display" aria-hidden>
        {locale === "fa" ? "۴۰۴" : "404"}
      </span>
      <h1 className="luca-h2">{t("pageNotFound")}</h1>
      <p className="max-w-[480px] leading-loose luca-muted">
        {t("notFoundHint")}
      </p>
    </div>
  );
}
