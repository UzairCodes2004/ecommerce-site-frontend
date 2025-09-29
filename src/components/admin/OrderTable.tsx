// src/components/admin/OrderTable.tsx
import React from "react";
import { Order } from "../../types/order";

interface OrderRowProps {
  order: Order;
  onShip: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onView: (orderId: string) => void;
  onMarkPaid: (orderId: string) => void;
  onRefund: (orderId: string) => void;
}

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onView: (orderId: string) => void;
  onShip: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  onMarkPaid: (orderId: string) => void;
  onRefund: (orderId: string) => void;
}

// Utility: format date safely
const formatDate = (value?: string | Date): string => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return String(value);
  }
};

// Single row
const OrderRow: React.FC<OrderRowProps> = ({
  order,
  onShip,
  onDeliver,
  onDelete,
  onCancel,
  onView,
  onMarkPaid,
  onRefund,
}) => {
  const orderId = order._id;
  const total = order.totalPrice.toFixed(2);

  const paid = order.isPaid ? formatDate(order.paidAt) : "No";
  const shipped = order.isShipped ? formatDate(order.shippedAt) : "No";
  const delivered = order.isDelivered ? formatDate(order.deliveredAt) : "No";
  const cancelled = order.isCancelled ? formatDate(order.cancelledAt) : "No";
  const refunded = order.isRefunded
    ? `${order.refundAmount ?? ""} (${formatDate(order.refundedAt)})`
    : "No";
  const created = formatDate(order.createdAt);

  const canRefund = order.isCancelled && order.isPaid && !order.isRefunded;

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-3 font-mono text-xs">
        {typeof order.user === "string"
          ? order.user
          : order.user?.name || order.user?._id || "—"}
      </td>

      <td className="px-4 py-3 font-mono text-sm">${total}</td>
      <td className="px-4 py-3">{paid}</td>
      <td className="px-4 py-3">{shipped}</td>
      <td className="px-4 py-3">{delivered}</td>
      <td className="px-4 py-3">{cancelled}</td>
      <td className="px-4 py-3">{refunded}</td>
      <td className="px-4 py-3">{created}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onMarkPaid(orderId)}
            disabled={order.isPaid || order.isCancelled}
            className={`px-3 py-1.5 text-xs rounded ${
              order.isPaid
                ? "bg-green-200 text-green-700 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {order.isPaid ? "Paid" : "Mark Paid"}
          </button>

          <button
            onClick={() => onShip(orderId)}
            disabled={order.isShipped || order.isCancelled}
            className={`px-3 py-1.5 text-xs rounded ${
              order.isShipped
                ? "bg-green-200 text-green-700 cursor-not-allowed"
                : "bg-amber-400 text-black hover:bg-amber-500"
            }`}
          >
            {order.isShipped ? "Shipped" : "Ship"}
          </button>

          <button
            onClick={() => onRefund(orderId)}
            disabled={!canRefund}
            className={`px-3 py-1.5 text-xs rounded ${
              order.isRefunded
                ? "bg-purple-200 text-purple-700 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {order.isRefunded ? "Refunded" : "Refund"}
          </button>

          <button
            onClick={() => onCancel(orderId)}
            disabled={order.isCancelled || order.isDelivered}
            className={`px-3 py-1.5 text-xs rounded ${
              order.isCancelled
                ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {order.isCancelled ? "Cancelled" : "Cancel"}
          </button>

          <button
            onClick={() => onDelete(orderId)}
            disabled={order.isShipped || order.isDelivered}
            className="px-3 py-1.5 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>

          <button
            onClick={() => onView(orderId)}
            className="px-3 py-1.5 text-xs rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
};

// Main table
const OrderTable: React.FC<OrderTableProps> = ({
  orders = [],
  loading = false,
  onShip,
  onDeliver,
  onDelete,
  onCancel,
  onView,
  onMarkPaid,
  onRefund,
}) => {
  if (loading)
    return (
      <div className="text-center py-6 text-gray-600">Loading orders...</div>
    );
  if (!orders || orders.length === 0)
    return (
      <div className="text-center py-6 text-gray-500">No orders found</div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Paid</th>
            <th className="px-4 py-3">Shipped</th>
            <th className="px-4 py-3">Delivered</th>
            <th className="px-4 py-3">Cancelled</th>
            <th className="px-4 py-3">Refunded</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onShip={onShip}
              onDeliver={onDeliver}
              onDelete={onDelete}
              onCancel={onCancel}
              onView={onView}
              onMarkPaid={onMarkPaid}
              onRefund={onRefund}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
