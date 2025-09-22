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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
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

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your order has been confirmed and is being processed. We'll send you
            a confirmation email shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Order Success Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-green-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
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
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Confirmed
                  </h2>
                  <p className="text-green-600">Your payment was successful</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <p className="font-medium text-gray-800">
                    {order?._id?.substring(0, 8)}...
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <p className="font-medium text-gray-800 capitalize">
                    {order?.paymentMethod || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order?.orderItems && order.orderItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://via.placeholder.com/48x48?text=Product";
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-800">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </div>
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            {order?.shippingAddress && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium text-gray-800">
                      {order.shippingAddress.address}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">City:</span>
                    <p className="font-medium text-gray-800">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Postal Code:</span>
                    <p className="font-medium text-gray-800">
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Country:</span>
                    <p className="font-medium text-gray-800">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${formatPrice(order?.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">
                    ${formatPrice(order?.taxPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-green-600">
                    ${formatPrice(order?.shippingPrice)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total:</span>
                    <span className="text-lg">
                      ${formatPrice(order?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {order?._id && (
                  <Link
                    to={`/orders/${order._id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg block text-center"
                  >
                    View Order Details
                  </Link>
                )}
                <Link
                  to="/products"
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 block text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/my-orders"
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 block text-center"
                >
                  View All Orders
                </Link>
              </div>

              {/* Support Information */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Need Help?
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Email: support@thrifties.com
                </p>
                <p className="text-xs text-gray-600">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 极 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    24-Hour Cancellation Policy
                  </h4>
                  <p className="text-xs text-blue-700">
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
