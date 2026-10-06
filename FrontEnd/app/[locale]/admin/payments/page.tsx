'use client';

import { useEffect, useMemo, useState } from 'react';

type Payment = {
  id: number;
  orderId: number;
  amount: number;
  status: string | number;
  paymentDate: string;
  transactionId?: string | null;
};

type PaymentsResponse = {
  isSuccess?: boolean;
  error?: string | null;
  data?: {
    records?: Payment[];
    totalCount?: number;
  };
};

const pageSize = 10;
const statusStyleMap: Record<string, string> = {
  success: 'luca-badge-solid',
  failed: '',
  pending: 'luca-badge-mute',
  cancelled: 'luca-badge-mute',
};

const statusLabelMap: Record<string, string> = {
  success: 'موفق',
  failed: 'ناموفق',
  pending: 'در انتظار',
  cancelled: 'لغو شده',
};

function normalizeStatus(status: string | number) {
  if (typeof status === 'number') {
    return ({ 1: 'pending', 2: 'success', 3: 'failed', 4: 'cancelled' } as Record<number, string>)[status] ?? 'unknown';
  }
  return status.toLowerCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'medium',
    timeZone: 'Asia/Tehran',
  }).format(date);
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPayments() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/auth/bff/admin/payments?page=1&pageSize=100', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });
        const payload = (await response.json()) as PaymentsResponse;
        if (!response.ok || payload.isSuccess === false) {
          throw new Error(payload.error || `HTTP ${response.status}`);
        }
        setPayments(payload.data?.records ?? []);
        setTotalCount(payload.data?.totalCount ?? payload.data?.records?.length ?? 0);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : 'خطا در دریافت پرداخت‌ها');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadPayments();
    return () => controller.abort();
  }, []);

  const filteredPayments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesQuery = normalizedQuery.length === 0 ||
        String(payment.id).includes(normalizedQuery) ||
        String(payment.orderId).includes(normalizedQuery) ||
        (payment.transactionId ?? '').toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === 'all' || normalizeStatus(payment.status) === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayments = filteredPayments.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';

  return (
    <div className="admin-page">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="admin-page-title">لیست تراکنش‌های پرداخت</h1>
          <p className="admin-page-subtitle">نمایش وضعیت پرداخت‌ها و تاریخ انجام تراکنش‌ها</p>
        </div>
        <span className="luca-badge luca-badge-mute">
          {totalCount} تراکنش
        </span>
      </div>

      <div>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="جستجو بر اساس شناسه یا تراکنش"
            className="!h-11 text-sm luca-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="!h-11 text-sm luca-input"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="success">موفق</option>
            <option value="pending">در انتظار</option>
            <option value="failed">ناموفق</option>
          </select>

          <div className="flex items-center justify-end text-sm text-slate-500">
            صفحه {safePage} از {totalPages}
          </div>
        </div>
      </div>

      <div className="border luca-line">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">سفارش</th>
                <th className="px-4 py-3">مبلغ</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3">تاریخ</th>
                <th className="px-4 py-3">شناسه تراکنش</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">در حال دریافت پرداخت‌ها...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-error">{error}</td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    رکوردی پیدا نشد.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 font-medium">#{payment.id}</td>
                    <td className="px-4 py-3">#{payment.orderId}</td>
                    <td className="px-4 py-3">{formatAmount(payment.amount)}</td>
                    <td className="px-4 py-3">
                      <span
                          className={`luca-badge ${statusStyleMap[normalizeStatus(payment.status)] ?? 'luca-badge-mute'}`}
                      >
                        {statusLabelMap[normalizeStatus(payment.status)] ?? payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(payment.paymentDate)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{payment.transactionId || 'بدون شناسه'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-t luca-line">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="disabled:opacity-40 disabled:cursor-not-allowed admin-btn"
          >
            قبلی
          </button>

          <span className="text-sm text-slate-600">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="disabled:opacity-40 disabled:cursor-not-allowed admin-btn"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
