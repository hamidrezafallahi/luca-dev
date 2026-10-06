"use client";

import React from 'react';

import { useTranslations } from 'next-intl';

function InvoiceList() {
  const t = useTranslations();
  const invoice = {
    invoiceNumber: 12,
    customerName: "ali",
    date: new Date().toISOString(),
    items: [
      {
        id: 1,
        title: "title",
        quantity: 12,
        unitPrice: 1200,
      },
    ],
  };

  return (
    <div
      className={`flex flex-col gap-4 p-6 bg-white border cursor-pointer transition-colors ${
        true ? "border-primary shadow-primary shadow-lg" : "border-gray-700"
      }`}
    >
      {/* ================= Header ================= */}
      <div className="flex justify-between items-start pb-3 border-line border-b">
        <div>
          <div className="font-semibold text-base">
            {t("checkout.invoiceNumber", { number: invoice.invoiceNumber })}
          </div>
          <div className="mt-1 text-mute text-xs">
            {t("checkout.customer", { name: invoice.customerName })}
          </div>
        </div>

        <div className="text-mute text-xs">{invoice.date}</div>
      </div>

      {/* ================= Items ================= */}
      <div className="space-y-2">
        {invoice.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 py-3 border-line border-b text-sm"
          >
            <div className="flex-1">{item.title}</div>

            <div className="w-16 text-mute text-center">
              {item.quantity}x
            </div>

            <div className="w-24 text-left">
              {(item.unitPrice * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* ================= Totals ================= */}
      <div className="space-y-2 pt-3 border-line border-t text-sm">
        <div className="flex justify-between text-mute">
          <span>{t("checkout.grandTotal")}</span>
          <span>{10000}</span>
        </div>

        <div className="flex justify-between font-semibold text-[17px]">
          <span>{t("checkout.payable")}</span>
          <span>{100000}</span>
        </div>
      </div>
    </div>
  );
}

export default InvoiceList;
