"use client";

import { useEffect, useState } from "react";
import handleAPI from "@/axios/handleAPI";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import LoaderText from "@/components/ui/LoadingText";
import { Button } from "@/components/ui/button";
import { IOrderAdmin } from "@/types/type";
import {
    formatCurrency,
    formatDateTime,
    formatVariant,
    ORDER_STATUS_STYLES,
    PAYMENT_STATUS_STYLES,
    PAY_TYPE_STYLES,
    badgeClass,
    extractErrorMessage,
} from "@/utils/orderHelpers";

interface OrderDetailModalProps {
  open: boolean;
  orderId: number | null;
  fallback?: IOrderAdmin | null;
  onClose: () => void;
}

export default function OrderDetailModal({
  open,
  orderId,
  fallback,
  onClose,
}: OrderDetailModalProps) {
  const [order, setOrder] = useState<IOrderAdmin | null>(fallback ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && fallback) {
      setOrder(fallback);
    }
  }, [open, fallback]);

  useEffect(() => {
    let cancelled = false;
    if (!open || !orderId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await handleAPI(`/admin/Order/${orderId}`);
        if (cancelled) return;
        if (res.status === 200) {
          setOrder(res.data as IOrderAdmin);
        } else {
          setError("Không tìm thấy thông tin đơn hàng");
        }
      } catch (err) {
        if (!cancelled) {
          setError(extractErrorMessage(err, "Không thể tải chi tiết đơn hàng"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [open, orderId]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="centered"
      size="lg"
      showOverlay
      className="bg-white"
    >
      <ModalHeader>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[#2b2b2b]">
            Order #{order?.id ?? orderId ?? ""}
          </h3>
          {order && (
            <span className="text-xs text-gray-500">
              Placed on {formatDateTime(order.orderDate)}
            </span>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase ${badgeClass(
            order?.statusOrder ?? "",
            ORDER_STATUS_STYLES
          )}`}
        >
          {order?.statusOrder ?? "-"}
        </span>
      </ModalHeader>

      <ModalBody className="gap-4" scrollable>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-32">
              <LoaderText />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        ) : order ? (
          <div className="flex flex-col gap-4 text-sm text-[#474747]">
            <section className="rounded-lg border border-gray-200 bg-[#fafafa] px-4 py-3">
              <h4 className="mb-2 text-sm font-semibold text-[#242424]">Order summary</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-gray-500">Order date</p>
                  <p className="text-sm font-medium text-[#242424]">
                    {formatDateTime(order.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Receive date</p>
                  <p className="text-sm font-medium text-[#242424]">
                    {formatDateTime(order.receiveDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Payment status</p>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass(
                      order.statusPay,
                      PAYMENT_STATUS_STYLES
                    )}`}
                  >
                    {order.statusPay || "-"}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Payment method</p>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass(
                      order.typePay,
                      PAY_TYPE_STYLES
                    )}`}
                  >
                    {order.typePay || "-"}
                  </span>
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <h4 className="mb-2 text-sm font-semibold text-[#242424]">Customer</h4>
                <p className="text-sm font-medium text-[#242424]">
                  {order.customerName || "Unknown customer"}
                </p>
                <p className="text-xs text-gray-500 break-all">
                  {order.customerEmail || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {order.customerPhone || "-"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <h4 className="mb-2 text-sm font-semibold text-[#242424]">Shipping address</h4>
                <p className="text-sm text-[#474747]">
                  {order.shippingAddress || "No shipping address"}
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-[#242424]">Item</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-gray-500">Product</p>
                  <p className="text-sm font-medium text-[#242424]">
                    {order.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatVariant(order.variantAttributes)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Pricing</p>
                  <p className="text-sm text-[#242424]">
                    Unit price: {formatCurrency(order.unitPrice)}
                  </p>
                  <p className="text-sm text-[#242424]">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-sm font-semibold text-[#242424]">
                    Total: {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            No detail available for this order.
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" className="px-6" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
