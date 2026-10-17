'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { reportClientError } from '@components/organisms/runtimeErrorBridge';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations('store');
  useEffect(() => {
    reportClientError(error.message, error, {
      scope: 'app/[locale]/error',
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center gap-3.5 mx-auto px-5 py-24 max-w-[520px] min-h-[70vh] text-ink text-center">
      <span
        className="flex justify-center items-center border-[1.5px] border-ink rounded-full w-[76px] h-[76px] text-3xl leading-none"
        aria-hidden
      >
        ×
      </span>
      <h1 className="luca-h2">{t('loadError')}</h1>
      <p className="leading-loose luca-muted">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : t('loadErrorRetryHint')}
      </p>
      {process.env.NODE_ENV === 'development' && error.digest ? (
        <p className="opacity-70 font-mono text-xs">digest: {error.digest}</p>
      ) : null}
      <button type="button" className="store-btn store-btn-primary" onClick={reset}>
        {t('retry')}
      </button>
    </div>
  );
}
