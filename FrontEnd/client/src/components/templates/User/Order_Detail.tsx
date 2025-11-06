"use client";

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const order = {
    id: orderId,
    date: "October 10, 2025",
    status: "Delivered",
    items: [
      {
        name: "Jacket",
        category: "COAT",
        qty: 2,
        price: "$54.99",
        subtotal: "$109.38",
        image:
          "https://res.cloudinary.com/do0im8hgv/image/upload/v1755614948/4eda7f01-e154-4df5-a6bd-ca78c8d1db9c.png",
      },
    ],
    subTotal: "$119.69",
    discount: "-$13.40",
    deliveryFee: "-$0.00",
    grandTotal: "$106.29",
    paymentDetails: "Cash on Delivery",
    address: {
      name: "Vincent Lobo",
      street: "3068 Woodlawn Drive",
      city: "Milwaukee",
      zip: orderId.replace("#", ""),
    },
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
      {/* Tabs */}
      <div className="flex justify-between items-center text-center mb-6 bg-[#F1F1F1] px-4 py-2 border border-[#E8ECEF] rounded-lg">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Items Ordered
        </button>

        <button className="px-4 py-2 text-gray-600">Invoices</button>

        <button className="px-4 py-2 text-gray-600">Order Shipment</button>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-2">Product Name</th>
              <th className="text-left pb-2">Price</th>
              <th className="text-left pb-2">Qty</th>
              <th className="text-left pb-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-2 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <span>
                    {item.name}{" "}
                    <span className="text-gray-500">{item.category}</span>
                  </span>
                </td>
                <td className="py-2">{item.price}</td>
                <td className="py-2">{item.qty}</td>
                <td className="py-2">{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Order Information</h3>
          <p>Sub Total: {order.subTotal}</p>
          <p>Discount: {order.discount}</p>
          <p>Delivery Fee: {order.deliveryFee}</p>
          <p className="font-semibold">Grand Total: {order.grandTotal}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Payment Details</h3>
          <p>{order.paymentDetails}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Address Details</h3>
          <p>{order.address.name}</p>
          <p>{order.address.street}</p>
          <p>{order.address.city}</p>
          <p>#{order.address.zip}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-end">
        <button className="relative inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group">
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">Reorder</span>
        </button>
        <button className="relative inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group">
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">Add Rating</span>
        </button>
      </div>
    </div>
  );
}
