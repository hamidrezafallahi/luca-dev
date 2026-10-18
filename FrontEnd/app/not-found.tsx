// app/not-found.tsx
import Link from 'next/link';

import { fontVariables } from '@lib/fonts';

/**
 * Global 404. Rendered outside the locale layout, so copy is static (fa) and,
 * because the root layout only returns children, it renders its own <html>.
 */
export default function NotFound() {
  return (
    <html lang="fa" dir="rtl" className={fontVariables}>
      <body className="bg-store-surface min-h-screen text-store-text antialiased">
    <div className="flex flex-col bg-white min-h-screen text-ink">
      <div className="flex justify-center items-center border-b h-16 md:h-[88px] luca-line">
        <Link href="/fa" aria-label="LUCA — صفحه اصلی لوکا" className="text-[30px] md:text-[42px] luca-wordmark">
          LUCA
        </Link>
      </div>
      <main className="flex flex-col flex-1 justify-center items-center gap-3.5 px-5 py-14 text-center">
        <span className="text-[120px] md:text-[140px] leading-none luca-display" aria-hidden>
          ۴۰۴
        </span>
        <h1 className="luca-h2">صفحه پیدا نشد</h1>
        <p className="max-w-[480px] leading-loose luca-muted">
          مورد درخواستی وجود ندارد یا حذف شده است.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <Link href="/fa" className="store-btn store-btn-primary">
            بازگشت به خانه
          </Link>
          <Link href="/fa/products" className="!h-14 store-btn">
            مشاهده محصولات
          </Link>
        </div>
      </main>
    </div>
      </body>
    </html>
  );
}
