"use client";

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Rate } from '@components/atoms/defaultElements/customRate';
import { SpinnerIcon } from '@components/atoms/iconComponents';
import { EnumTargetType } from '@models/comment';
import { useGetConditionallyMutation } from '@services/base';
import {
  getCookie,
  showErrorToast,
} from '@utils/core';

export default function ProductCommentForm({ id }: { id: number }) {
const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const [value, setValue] = useState(0);
  const [mutateCommand, { isLoading }] = useGetConditionallyMutation();
  const [mutateRate] = useGetConditionallyMutation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleSetRate = async (e: number) => {
    const res = await mutateRate({
      url: "/Rates",
      body: {
        targetId: id,
        targetType: EnumTargetType.Product,
        value: e,
      },
      method: "POST",
    });
    if (res) {
      console.log(res);
    }
    setValue(e);
  };
  const handleSubmitComment = async () => {
    const comment = textAreaRef.current?.value.trim();
    if (comment?.length === 0) {
      showErrorToast(t('product.pleaseWriteComment'));
      textAreaRef.current?.focus();
      return;
    } else {
      const res = await mutateCommand({
        url: "/Comments",
        body: {
          targetId: id,
          targetType: EnumTargetType.Product,
          content: comment,
        },
        method: "POST",
      });
      if (res.data) {
        console.log(res);
      }
    }
  };
  const redirectUrl = encodeURIComponent(pathname);
  useEffect(() => {
  setIsAuthenticated(Boolean(getCookie("candySession")));
}, []);
  return (
    <div className="flex flex-col items-start gap-3 mt-6 max-w-[820px]">
      {isAuthenticated ? (
        <>
          <div>
            <Rate mode="rate" value={value} onChange={handleSetRate} />
          </div>
          <textarea
            ref={textAreaRef}
            className="resize-none luca-input"
            placeholder={t('product.writeCommentPlaceholder')}
          />
          <button
            onClick={handleSubmitComment}
            disabled={isLoading}
            className="store-btn store-btn-primary"
          >
            {isLoading ? <SpinnerIcon /> : <span>{t('product.submitComment')}</span>}
          </button>
        </>
      ) : (
        <Link
          className="store-btn store-btn-primary"
          href={`/${locale}/register?redirect=${redirectUrl}`}
        >
          {t("general.loginFirst")}
        </Link>
      )}
    </div>
  );
}
