import { useTranslations } from 'next-intl';

import { OrderStatusText } from '@models/order';
import { useGetData } from '@services/base';
import { toMediaUrl } from '@utils/toMediaUrl';

import { IOrder } from './type';

export default function OrderDetails({
  selectedOrderId,
}: {
  selectedOrderId: number | null;
}) {
  const t = useTranslations();
  const { data, isLoading } = useGetData<IOrder>({
    url: `/orders/${selectedOrderId}`,
    method: "GET",
    skip: !selectedOrderId,
  });

  if (!selectedOrderId)
    return (
      <div className="py-24 text-mute text-center">
        {t("order.selectOrder")}
      </div>
    );

  const order = data?.data;
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="mx-auto mb-4 border-line border-t-ink border-[3px] rounded-full w-14 h-14 animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <h2 className="luca-h3">{t("order.orderDetails")}</h2>
          <div className="py-3 border-line border-t border-b">
            <div className="flex justify-between">
              <span>{t("order.status")}</span>
              {order?.status !== undefined && (
                <span>{t(OrderStatusText[order.status])}</span>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col border-line border-b">
            {order?.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-3.5 border-line border-t"
              >
                <img
                  src={toMediaUrl(item.product.image)}
                  className="w-16 h-16 object-cover luca-ph"
                />

                <div className="flex flex-col flex-1 justify-between">
                  <div className="text-sm">{item.product.name}</div>
                  <div className="text-mute text-xs">
                    {t("common.quantityCount", { count: item.quantity })}
                  </div>
                  <div className="text-mute text-xs">
                    {item.product.description}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {item.unitPrice} {t("common.currency")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            <div className="flex justify-between mb-1 text-sm">
              <span>{t("order.orderTotal")}</span>
              <span>
                {order?.totalPrice} {t("common.currency")}
              </span>
            </div>
            <div className="flex justify-between mb-1 text-mute text-sm">
              <span>{t("order.shippingCost")}</span>
              <span>
                {order?.shippingMethod.cost} {t("common.currency")}
              </span>
            </div>
            <div className="flex justify-between mb-1 text-mute text-sm">
              <span>{t("order.discount")}</span>
              <span>
                {order?.discountPrice} {t("common.currency")}
              </span>
            </div>

            <div className="flex justify-between mt-3 pt-3 border-line border-t font-semibold text-[17px]">
              <span>{t("order.finalAmount")}</span>
              <span>
                {(order?.totalPrice! + order?.shippingMethod?.cost!) -
                  order?.discountPrice!}{" "}
                {t("common.currency")}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
