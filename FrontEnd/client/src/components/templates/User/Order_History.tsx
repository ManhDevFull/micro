"use client";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";

// Cấu trúc dữ liệu tối thiểu nhận được từ Backend (OrderHistoryDTO)
// interface OrderHistoryItem {
//   OrderId: number;
//   OrderDate: string; // ISO Date String
//   StatusOrder: string;
//   TotalPriceAfterDiscount: number;
// }

interface OrderHistoryItem {
  orderId: number;
  orderDate: string;
  statusOrder: string;
  totalPriceAfterDiscount: number;
}


interface OrderHistoryProps {
  onSelectOrder: (id: string) => void;
}

export default function OrderHistory({ onSelectOrder }: OrderHistoryProps) {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: any = await handleAPI("/Order/my-orders", undefined, "get");
        console.log("Fetched order history:", response);
        setOrders(response);
      } catch (err: any) {
        console.error("Error fetching order history:", err);
        const errorMsg = err.response?.data?.message || "Failed to load order history.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatOrderDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatPrice = (price: number) => {
    // Sử dụng ?? 0 để đảm bảo toLocaleString được gọi trên kiểu number
    return (price ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
  };



  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-300">
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949098/image_2_h5wwjb.png"
          alt="Orders Icon"
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Orders History</h2>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-10 text-gray-600">Loading order history...</div>
      )}

      {!isLoading && error && (
        <div className="text-center py-10 text-red-500">{error}</div>
      )}

      {/* Data Table */}
      {!isLoading && !error && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              You don’t have any orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-['Public Sans'] text-[14px]">
                <thead>
                  <tr className="border-b border-[#E8ECEF] text-gray-700">
                    <th className="py-3 px-4 font-bold">Number ID</th>
                    <th className="py-3 px-4 font-bold">Dates</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="py-3 px-4">#{order.orderId}</td>
                      <td className="py-3 px-4">{formatOrderDate(order.orderDate)}</td>
                      <td className="py-3 px-4">{order.statusOrder}</td>
                      <td className="py-3 px-4">{formatPrice(order.totalPriceAfterDiscount)}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Button (giữ nguyên từ file gốc) */}
      <div className="mt-8 flex justify-left">
        <button
          onClick={() => alert("Redirect to enquiry form")}
          className="relative inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group"
        >
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">
            What to enquire about your order?
          </span>
        </button>
      </div>
    </div>
  );
}