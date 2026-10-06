import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-3.5 px-5 py-24 text-center">
      <span className="text-[120px] leading-none luca-display" aria-hidden>
        ۴۰۴
      </span>
      <h1 className="luca-h2">صفحه پیدا نشد</h1>
      <p className="max-w-[480px] leading-loose luca-muted">
        مورد درخواستی وجود ندارد یا حذف شده است.
      </p>
    </div>
  );
}
