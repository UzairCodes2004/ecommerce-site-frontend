import React from "react";
import { Link, useLocation } from "react-router-dom";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
}

interface Order {
  _id?: string;
  orderItems?: OrderItem[];
  itemsPrice?: number;
  taxPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
}

interface LocationState {
  order?: Order;
}

const ThankYou = () => {
  const location = useLocation();
  const { order } = (location.state as LocationState) || {};

  const formatPrice = (value: number | undefined) => {
    if (value === undefined || value === null) return "0.00";
    return Number(value).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-12">
          <div className="w-28 h-28 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-12 h-12 text-white transform scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your order has been confirmed and is being processed. We'll send you
            a confirmation email shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Success Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100/50 backdrop-blur-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Confirmed
                  </h2>
                  <p className="text-emerald-600 font-medium">
                    Payment successful
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm text-gray-500 block mb-1">
                    Order ID:
                  </span>
                  <p className="font-semibold text-gray-900 text-lg">
                    {order?._id?.substring(0, 8)}...
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm text-gray-500 block mb-1">
                    Payment Method:
                  </span>
                  <p className="font-semibold text-gray-900 text-lg capitalize">
                    {order?.paymentMethod || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order?.orderItems && order.orderItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://via.placeholder.com/64x64?text=Product";
                              }}
                            />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {item.qty}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 text-lg">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            {order?.shippingAddress && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">
                      Address:
                    </span>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.address}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">
                      City:
                    </span>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">
                      Postal Code:
                    </span>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">
                      Country:
                    </span>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${formatPrice(order?.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold text-gray-900">
                    ${formatPrice(order?.taxPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-emerald-600">
                    ${formatPrice(order?.shippingPrice)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${formatPrice(order?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {order?._id && (
                  <Link
                    to={`/orders/${order._id}`}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2 15.5v-11a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2z"
                      />
                    </svg>
                    View Order Details
                  </Link>
                )}
                <Link
                  to="/products"
                  className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Continue Shopping
                </Link>
                <Link
                  to="/my-orders"
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  View All Orders
                </Link>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    24-Hour Cancellation Policy
                  </h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Paid orders can be cancelled within 24 hours of placement.
                    Visit your order history to manage your orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
