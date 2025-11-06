'use client';

import { memo, useMemo } from 'react';
import LoaderText from '@/components/ui/LoadingText';
import OrderAction from '@/components/templates/Admin/OrderAction';
import type { IOrderAdmin } from '@/types/type';
import {
  ORDER_STATUS_STYLES,
  badgeClass,
  formatCurrency,
  formatDateTime,
  formatVariant,
} from '@/utils/orderHelpers';

type OrdersTableProps = {
  orders: IOrderAdmin[];
  loading: boolean;
  onView: (order: IOrderAdmin) => void;
  onShip: (order: IOrderAdmin) => void;
  onDeliver: (order: IOrderAdmin) => void;
  onCancel: (order: IOrderAdmin) => void;
};

function OrdersTable({
  orders,
  loading,
  onView,
  onShip,
  onDeliver,
  onCancel,
}: OrdersTableProps) {
  const scrollContainerStyle = useMemo(
    () => ({ maxHeight: 'calc(100vh - 330px)' }),
    []
  );

  return (
    <div className="relative mt-4 rounded-lg border border-gray-200 bg-white shadow">
      <div
        className={`grid grid-cols-24 overflow-hidden rounded-t-lg bg-[#f4f4f4] text-[#474747] ${
          loading ? 'opacity-50' : ''
        }`}
      >
        <div className="col-span-3 py-3 text-center text-sm font-medium">Order ID</div>
        <div className="col-span-4 py-3 pl-3 text-sm font-medium">Customer</div>
        <div className="col-span-5 py-3 pl-3 text-sm font-medium">Product</div>
        <div className="col-span-2 py-3 text-center text-sm font-medium">Qty</div>
        <div className="col-span-3 py-3 text-center text-sm font-medium">Total</div>
        <div className="col-span-5 py-3 text-center text-sm font-medium">Status</div>
        <div className="col-span-2 py-3 text-center text-sm font-medium">Actions</div>

        <div className="col-span-24 overflow-y-auto bg-white scrollbar-hidden" style={scrollContainerStyle}>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <LoaderText />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-[#474747]">
              <p className="text-sm text-gray-500">No orders matched the current filters.</p>
            </div>
          ) : (
            orders.map((order) => {
              const statusUpper = (order.statusOrder ?? '').toUpperCase();
              const isPending = statusUpper === 'PENDING';
              const isShipped = statusUpper === 'SHIPPED';
              const isDelivered = statusUpper === 'DELIVERED';
              const isCancelled = statusUpper === 'CANCELLED';

              const disabledActions = {
                ship: !isPending,
                deliver: !(isPending || isShipped),
                cancel: isDelivered || isCancelled,
              };

              return (
                <div
                  key={order.id}
                  className="grid grid-cols-24 items-start border-t border-[#00000008] bg-white text-[#474747]"
                >
                  <div className="col-span-3 flex h-full flex-col items-center justify-center gap-1 py-3 text-center">
                    <span className="text-sm font-medium text-[#2b2b2b]">#{order.id}</span>
                    <span className="text-xs text-gray-500">{formatDateTime(order.orderDate)}</span>
                  </div>
                  <div className="col-span-4 flex h-full flex-col justify-center gap-1 border-l border-[#00000008] px-3 py-3">
                    <span className="text-sm font-medium text-[#242424]">
                      {order.customerName || 'Unknown customer'}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{order.customerEmail}</span>
                    <span className="text-xs text-gray-500">{order.customerPhone || '-'}</span>
                    <span className="text-xs text-gray-500">{order.shippingAddress || '-'}</span>
                  </div>
                  <div className="col-span-5 flex h-full gap-3 border-l border-[#00000008] px-3 py-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-[#fafafa]">
                      {order.productImage ? (
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">N/A</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-[#242424]">{order.productName}</span>
                      <span className="text-xs text-gray-500">{formatVariant(order.variantAttributes)}</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex h-full flex-col items-center justify-center gap-1 border-l border-[#00000008] py-3">
                    <span className="text-sm font-semibold text-[#242424]">{order.quantity}</span>
                    <span className="text-xs text-gray-500">{formatCurrency(order.unitPrice)}</span>
                  </div>
                  <div className="col-span-3 flex h-full flex-col items-center justify-center gap-1 border-l border-[#00000008] py-3">
                    <span className="text-sm font-semibold text-[#242424]">{formatCurrency(order.totalPrice)}</span>
                  </div>
                  <div className="col-span-5 flex h-full flex-col items-center justify-center gap-2 border-l border-[#00000008] py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold uppercase ${badgeClass(
                        order.statusOrder,
                        ORDER_STATUS_STYLES,
                      )}`}
                    >
                      {order.statusOrder || '-'}
                    </span>
                    {order.typePay === 'COD' && order.statusPay === 'UNPAID' && (
                      <span className="text-xs text-gray-500">Collect on delivery</span>
                    )}
                  </div>
                  <div className="col-span-2 flex h-full items-center justify-center border-l border-[#00000008] py-3">
                    <OrderAction
                      onView={() => onView(order)}
                      onShip={() => onShip(order)}
                      onDeliver={() => onDeliver(order)}
                      onCancel={() => onCancel(order)}
                      disabled={disabledActions}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(OrdersTable);
