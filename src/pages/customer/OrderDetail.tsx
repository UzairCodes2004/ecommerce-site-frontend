import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";
import { useToast } from "../../contexts/ToastContext";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentOrder,
    fetchOrderById,
    cancelOrder,
    setCurrentOrder,
    loading,
    error,
  } = useOrderStore();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderById(id).catch(console.error);
    }
  }, [id, fetchOrderById]);

  if (loading || !currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-800">Error loading order: {error}</span>
            </div>
            <button
              onClick={() => navigate("/my-orders")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = !currentOrder.isCancelled && !currentOrder.isPaid;
  const isWithin24Hours = (orderDate: string) => {
    const orderTime = new Date(orderDate).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };
  const canCancelPaidOrder =
    currentOrder.isPaid &&
    !currentOrder.isCancelled &&
    isWithin24Hours(currentOrder.createdAt || "");

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLocalLoading(true);
      const updatedOrder = await cancelOrder(currentOrder._id || "");
      setCurrentOrder(updatedOrder);
      showSuccess("Order cancelled successfully!");
      setTimeout(() => {
        navigate("/my-orders", { replace: true });
      }, 1500);
    } catch (err: any) {
      showError(
        err.friendlyMessage ||
          err.message ||
          "Failed to cancel order. Please try again."
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (order: any) => {
    if (order.isCancelled) {
      return {
        color: "red",
        icon: (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
        text: "Cancelled",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      };
    } else if (order.isDelivered) {
      return {
        color: "green",
        icon: (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
        text: "Delivered",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
      };
    } else if (order.isShipped) {
      return {
        color: "blue",
        icon: (
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c极 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
        text: "Shipped",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
      };
    } else if (order.isPaid) {
      return {
        color: "purple",
        icon: (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 极z"
            />
          </svg>
        ),
        text: "Paid",
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
      };
    } else {
      return {
        color: "yellow",
        icon: (
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        text: "Pending Payment",
        bgColor: "bg-amber-100",
        textColor: "text-amber-700",
      };
    }
  };

  const statusConfig = getStatusConfig(currentOrder);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Details
            </h1>
            <p className="text-gray-600">
              Order #{currentOrder._id?.substring(0, 8)}...
            </p>
          </div>
          <Link
            to="/my-orders"
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mt-4 sm:mt-0"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to My Orders
          </Link>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${statusConfig.bgColor} rounded-xl`}>
                {statusConfig.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Order Status
                </h3>
                <p className={`text-sm ${statusConfig.textColor} font-medium`}>
                  {statusConfig.text}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium text-gray-800">
                {formatDate(currentOrder.createdAt || "")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Order Information */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Shipping Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-800">
                  {currentOrder.shippingAddress?.address}
                </p>
                <p className="text-gray-600">
                  {currentOrder.shippingAddress?.city},{" "}
                  {currentOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-600">
                  {currentOrder.shippingAddress?.country}
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Payment Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium text-gray-800">
                    {currentOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      currentOrder.isPaid ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {currentOrder.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
                {currentOrder.isPaid && currentOrder.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid on:</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(currentOrder.paidAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Order Items ({currentOrder.orderItems?.length || 0})
              </h3>
              <div className="space-y-4">
                {currentOrder.orderItems?.length > 0 ? (
                  currentOrder.orderItems.map((it: any) => (
                    <div
                      key={it.product}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/64x64?text=Product";
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{it.name}</p>
                          <p className="text-sm text-gray-500">Qty: {it.qty}</p>
                          <p className="text-sm text-gray-500">
                            ${it.price} each
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800">
                        ${(it.qty * it.price).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No items found in this order.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">
                    ${currentOrder.itemsPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    ${currentOrder.shippingPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">
                    ${currentOrder.taxPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      ${currentOrder.totalPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(canCancel || canCancelPaidOrder) && !currentOrder.isCancelled && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Actions
                </h3>
                <button
                  onClick={handleCancel}
                  disabled={localLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    localLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 transform hover:scale-105"
                  } text-white shadow-lg`}
                >
                  {localLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Cancelling...
                    </div>
                  ) : (
                    "Cancel Order"
                  )}
                </button>

                {currentOrder.isPaid && !currentOrder.isCancelled && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Paid orders can be cancelled within
                      24 hours of placement.
                      {!isWithin24Hours(currentOrder.createdAt || "") && (
                        <span className="text-red-600 font-medium block mt-1">
                          This order is no longer eligible for cancellation.
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-800">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(currentOrder.createdAt || "")}
                    </p>
                  </div>
                </div>

                {currentOrder.isPaid && currentOrder.paidAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Payment Completed
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(currentOrder.paidAt)}
                      </p>
                    </div>
                  </div>
                )}

                {currentOrder.isShipped && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800">Order Shipped</p>
                      <p className="text-sm text-gray-600">
                        Your order is on the way
                      </p>
                    </div>
                  </div>
                )}

                {currentOrder.isDelivered && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Order Delivered
                      </p>
                      <p className="text-sm text-gray-600">
                        Your order has been delivered
                      </p>
                    </div>
                  </div>
                )}

                {currentOrder.isCancelled && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Order Cancelled
                      </p>
                      <p className="text-sm text-gray-600">
                        This order has been cancelled
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
