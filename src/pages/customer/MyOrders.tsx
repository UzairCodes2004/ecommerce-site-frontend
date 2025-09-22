import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useOrderStore from "../../store/orderStore";

const MyOrders = () => {
  const { myOrders, fetchMyOrders, loading, error, markAsDelivered } =
    useOrderStore();
  const location = useLocation();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Refresh orders when navigating back
  useEffect(() => {
    if (location.pathname === "/my-orders") {
      const timer = setTimeout(() => {
        fetchMyOrders();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, fetchMyOrders]);

  // Refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === "/my-orders") {
        fetchMyOrders();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [location.pathname, fetchMyOrders]);

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await markAsDelivered(orderId);
      // Refresh orders to show updated status
      fetchMyOrders();
    } catch (err: any) {
      alert(err.message || "Failed to mark as delivered");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (order: any) => {
    if (order.isCancelled) {
      return (
        <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          Cancelled
        </span>
      );
    } else if (order.isDelivered) {
      return (
        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          Delivered
        </span>
      );
    } else if (order.isShipped) {
      return (
        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          Shipped
        </span>
      );
    } else if (order.isPaid) {
      return (
        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          Paid
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
          Pending
        </span>
      );
    }
  };

  const renderPriceBreakdown = (order: any, isCancelled = false) => (
    <div
      className={`space-y-1 text-sm ${
        isCancelled ? "text-gray-500" : "text-gray-600"
      }`}
    >
      <div className="flex justify-between">
        <span>Items:</span>
        <span>${order.itemsPrice?.toFixed(2) || "0.00"}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax:</span>
        <span>${order.taxPrice?.toFixed(2) || "0.00"}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping:</span>
        <span>${order.shippingPrice?.toFixed(2) || "0.00"}</span>
      </div>
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between font-semibold text-gray-800">
          <span>Total:</span>
          <span>${order.totalPrice?.toFixed(2) || "0.00"}</span>
        </div>
      </div>
    </div>
  );

  const activeOrders = myOrders.filter((order: any) => !order.isCancelled);
  const cancelledOrders = myOrders.filter((order: any) => order.isCancelled);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
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
                  d="M12 8v4m0 4h.01M21 12a9 9 极 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-lg font-semibold text-blue-600">
                {myOrders.length}
              </p>
            </div>
          </div>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 极 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Active Orders ({activeOrders.length})
                </h3>
                <div className="space-y-4">
                  {activeOrders.map((o: any) => (
                    <div
                      key={o._id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {getStatusBadge(o)}
                            </div>
                            <p className="text-sm text-gray-600">
                              Order #: {o._id?.substring(0, 8)}...
                            </p>
                          </div>

                          <p className="text-sm text-gray-600 mb-4">
                            Placed on: {formatDate(o.createdAt)}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">
                                Items Summary
                              </h4>
                              <p className="text-sm text-gray-600">
                                {o.orderItems?.length || 0} item
                                {o.orderItems?.length !== 1 ? "s" : ""}
                              </p>
                              {o.orderItems
                                ?.slice(0, 2)
                                .map((item: any, index: number) => (
                                  <p
                                    key={index}
                                    className="text-sm text-gray-600 truncate"
                                  >
                                    • {item.name}
                                  </p>
                                ))}
                              {o.orderItems?.length > 2 && (
                                <p className="text-sm text-gray-600">
                                  +{o.orderItems.length - 2} more items
                                </p>
                              )}
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">
                                Price Breakdown
                              </h4>
                              {renderPriceBreakdown(o)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:w-48">
                          <Link
                            to={`/orders/${o._id}`}
                            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
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
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Details
                          </Link>

                          {/* Mark as Received Button */}
                          {o.isShipped && !o.isDelivered && !o.isCancelled && (
                            <button
                              onClick={() => handleMarkAsDelivered(o._id)}
                              className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
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
                              Mark as Received
                            </button>
                          )}

                          {/* Delivered Status */}
                          {o.isDelivered && (
                            <div className="bg-green-100 text-green-800 px-4 py-2.5 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2">
                              <svg
                                className="w-4 h-4"
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
                              Received
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Orders */}
            {cancelledOrders.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600"
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
                  Cancelled Orders ({cancelledOrders.length})
                </h3>
                <div className="space-y-4">
                  {cancelledOrders.map((o: any) => (
                    <div
                      key={o._id}
                      className="bg-gray-50 border border-gray-200 rounded-2xl p-6 opacity-75"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {getStatusBadge(o)}
                            </div>
                            <p className="text-sm text-gray-500">
                              Order #: {o._id?.substring(0, 8)}...
                            </p>
                          </div>

                          <p className="text-sm text-gray-500 mb-4">
                            Placed on: {formatDate(o.createdAt)}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Items Summary
                              </h4>
                              <p className="text-sm text-gray-500">
                                {o.orderItems?.length || 0} item
                                {o.orderItems?.length !== 1 ? "s" : ""}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Price Breakdown
                              </h4>
                              {renderPriceBreakdown(o, true)}
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-48">
                          <Link
                            to={`/orders/${o._id}`}
                            className="bg-gray-400 text-white px-4 py-2.5 rounded-xl hover:bg-gray-500 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
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
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-极.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
