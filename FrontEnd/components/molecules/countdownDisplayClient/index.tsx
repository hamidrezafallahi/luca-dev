"use client";
import React, {
  useEffect,
  useState,
} from 'react';

import { useTranslations } from 'next-intl';

interface CountdownDisplayClientProps {
  targetTime: number;
}

export default function CountdownDisplayClient({ targetTime }: CountdownDisplayClientProps) {
  const t = useTranslations('countdown');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const isExpired =
    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired)
    return (
      <p className="text-[13px]">
        {t('expired')}
      </p>
    );

  return (
    <div className="flex items-start gap-2 text-center" dir="ltr">
      <TimeBox value={timeLeft.hours} label={t('hours')} />
      <span className="pt-1" aria-hidden>:</span>
      <TimeBox value={timeLeft.minutes} label={t('minutes')} />
      <span className="pt-1" aria-hidden>:</span>
      <TimeBox value={timeLeft.seconds} label={t('seconds')} />
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="px-2 py-1 border border-current min-w-[44px] text-xl leading-tight luca-display">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="opacity-80 mt-1 text-[11px]">{label}</span>
    </div>
  );
}

function calculateTimeLeft(target: number) {
  const now = new Date().getTime();
  const diff = Math.max(0, target - now);
  return {
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
