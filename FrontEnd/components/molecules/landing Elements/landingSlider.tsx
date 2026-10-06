"use client";
import React, {
  useEffect,
  useState,
} from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { IcChevronLeft, IcChevronRight } from '@components/atoms/lucaIcons';

export type LandingSlideImage = {
  bannerUrl: string;
  firstUrl: string;
};

interface IProps {
  images: LandingSlideImage[];
}

function LandingSlider({ ...props }: IProps) {
  const { images } = props;
  const locale = useLocale();
  const t = useTranslations('landing');
  const [current, setCurrent] = useState(0);
  const length = images.length;
  useEffect(() => {
    if (length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearInterval(interval);
  }, [length]);

  if (length === 0) {
    return null;
  }

  const goToSlide = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);
  return (
    <section className="py-2 md:py-4 luca-container" aria-roledescription="carousel">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[400px] xl:h-[600px] overflow-hidden luca-ph">
          {images.map((item, index) => {
            const href = item.firstUrl?.trim()
              ? `/${locale}/${item.firstUrl.replace(/^\/+/, '')}`
              : `/${locale}`;

            return (
              <div
                key={`${item.bannerUrl}-${index}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <MediaImage
                  src={item.bannerUrl}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                <Link
                  href={href}
                  aria-label={t('slideDetailsAria', { index: index + 1 })}
                  className="bottom-6 absolute inline-flex justify-center items-center bg-white hover:bg-ink px-8 h-[52px] font-medium text-ink hover:text-white text-sm transition-colors start-6 md:start-10"
                >
                  {t('slideCta')}
                </Link>
              </div>
            );
          })}

          {length > 1 ? (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label={t('prevSlide')}
                className="top-1/2 left-3 z-20 absolute flex justify-center items-center bg-white hover:bg-ink w-11 h-11 text-ink hover:text-white transition-colors -translate-y-1/2"
              >
                <IcChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label={t('nextSlide')}
                className="top-1/2 right-3 z-20 absolute flex justify-center items-center bg-white hover:bg-ink w-11 h-11 text-ink hover:text-white transition-colors -translate-y-1/2"
              >
                <IcChevronRight size={18} />
              </button>
            </>
          ) : null}
        </div>

        {length > 1 ? (
          <div className="flex justify-center items-center gap-1 h-9" dir="ltr">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className="flex justify-center items-center w-6 h-9"
                onClick={() => goToSlide(index)}
                aria-label={t('goToSlideAria', { index: index + 1 })}
                aria-current={index === current ? 'true' : undefined}
              >
                <span
                  className={`block rounded-full w-1.5 h-1.5 ${
                    index === current ? "bg-ink" : "bg-[#c4c4bf]"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default LandingSlider;
