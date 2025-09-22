// src/pages/admin/OrderManagement.tsx
import React, { useEffect, useState } from "react";
import OrderTable from "../../components/admin/OrderTable";
import useOrderStore from "../../store/orderStore";
import { put as apiPut } from "../../services/api";
import type { Order, OrderItem, ShippingAddress } from "../../types/order";

// ✅ Confirmation Modal
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
      <p className="text-gray-800">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// ✅ Order Details Modal
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}
const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;
  const items: OrderItem[] = order.orderItems || [];
  const shipping: ShippingAddress = order.shippingAddress;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-auto max-h-[80vh]">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">Order {order._id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>

        {/* Shipping */}
        <section className="mt-4">
          <h3 className="font-medium">Shipping</h3>
          <p>{shipping?.address ?? "—"}</p>
          <p className="text-sm text-gray-500">
            {shipping?.city ? `${shipping.city}, ${shipping.postalCode ?? ""}` : ""}
          </p>
        </section>

        {/* Items */}
        <section className="mt-4">
          <h3 className="font-medium">Items</h3>
          <div className="mt-2 space-y-2">
            {items.length === 0 && <div className="text-sm text-gray-500">No items</div>}
            {items.map((it) => (
              <div key={it._id} className="flex items-center gap-4 border rounded p-2">
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.qty}</div>
                </div>
                <div className="font-semibold">${(it.price ?? 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="mt-4">
          <h3 className="font-medium">Summary</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-sm text-gray-600">Items</div>
            <div className="text-right">${order.itemsPrice.toFixed(2)}</div>

            <div className="text-sm text-gray-600">Shipping</div>
            <div className="text-right">${order.shippingPrice.toFixed(2)}</div>

            <div className="text-sm text-gray-600">Tax</div>
            <div className="text-right">${order.taxPrice.toFixed(2)}</div>

            {order.isRefunded && (
              <>
                <div className="text-sm text-gray-600">Refund Amount</div>
                <div className="text-right text-red-600">
                  -${(order.refundAmount ?? order.totalPrice).toFixed(2)}
                </div>
              </>
            )}

            <div className="text-sm text-gray-600">Total</div>
            <div className="text-right font-bold">${order.totalPrice.toFixed(2)}</div>
          </div>
        </section>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Created: {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="ml-auto space-x-2">
            <span className="text-sm">Paid: {order.isPaid ? "Yes" : "No"}</span>
            <span className="text-sm">Shipped: {order.isShipped ? "Yes" : "No"}</span>
            <span className="text-sm">Delivered: {order.isDelivered ? "Yes" : "No"}</span>
            <span className="text-sm">Cancelled: {order.isCancelled ? "Yes" : "No"}</span>
            <span className="text-sm">Refunded: {order.isRefunded ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component
const OrderManagement: React.FC = () => {
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [confirmState, setConfirmState] = useState<{
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const {
    allOrders,
    loading,
    error,
    fetchAllOrders,
    fetchOrderById,
    cancelOrder: cancelOrderInStore,
    deleteOrder: deleteOrderInStore,
    markAsDelivered,
    markAsPaid,
    refundCancelledOrder,
  } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    setFilteredOrders(allOrders);
  }, [allOrders]);

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!query) {
  //     setFilteredOrders(allOrders);
  //     return;
  //   }
  //   const q = query.trim().toLowerCase();
  //   const filtered = allOrders.filter((o) => {
  //     const id = (o._id ?? "").toString().toLowerCase();
  //     const city = o.shippingAddress?.city?.toLowerCase() ?? "";
  //     return id.includes(q) || city.includes(q);
  //   });
  //   setFilteredOrders(filtered);
  // };

  const openDetails = async (orderId: string) => {
    try {
      const data = await fetchOrderById(orderId);
      setModalOrder(data);
    } catch (err: any) {
      alert(err.message || "Failed to load order details");
    }
  };

  const closeDetails = () => setModalOrder(null);

  // 🔹 Cancel
  const handleCancel = (orderId: string) => {
    setConfirmState({
      message: "Are you sure you want to cancel this order?",
      onConfirm: async () => {
        try {
          await cancelOrderInStore(orderId);
          fetchAllOrders();
        } catch (err: any) {
          alert(err.message || "Failed to cancel order");
        } finally {
          setConfirmState(null);
        }
      },
      onCancel: () => setConfirmState(null),
    });
  };

  // 🔹 Delete
  const handleDelete = (orderId: string) => {
    setConfirmState({
      message: "Delete this order permanently?",
      onConfirm: async () => {
        try {
          await deleteOrderInStore(orderId);
          fetchAllOrders();
        } catch (err: any) {
          alert(err.message || "Failed to delete order");
        } finally {
          setConfirmState(null);
        }
      },
      onCancel: () => setConfirmState(null),
    });
  };

  // 🔹 Refund
  const handleRefund = (orderId: string) => {
    setConfirmState({
      message: "Process refund for this cancelled order? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await refundCancelledOrder(orderId);
          fetchAllOrders();
          alert("Refund processed successfully!");
        } catch (err: any) {
          alert(err.message || "Failed to process refund");
        } finally {
          setConfirmState(null);
        }
      },
      onCancel: () => setConfirmState(null),
    });
  };

  // 🔹 Ship
  const handleShip = async (orderId: string) => {
    try {
      await apiPut(`/orders/${orderId}/ship`, {});
      fetchAllOrders();
    } catch (err: any) {
      alert(err.message || "Failed to mark order as shipped");
    }
  };

  // 🔹 Deliver
  const handleDeliver = async (orderId: string) => {
    try {
      await markAsDelivered(orderId);
      fetchAllOrders();
    } catch (err: any) {
      alert(err.message || "Failed to mark order as delivered");
    }
  };

  // 🔹 Mark Paid
  const handleMarkPaid = async (orderId: string) => {
    try {
      await markAsPaid(orderId);
      window.alert("Order marked as paid successfully.");
      fetchAllOrders();
    } catch (err: any) {
      window.alert(err.message || "Failed to mark order as paid.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order Management</h1>
        
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        <OrderTable
          orders={filteredOrders}
          loading={loading}
          onView={(id: string) => openDetails(id)}
          onShip={(id: string) => handleShip(id)}
          onDeliver={(id: string) => handleDeliver(id)}
          onCancel={(id: string) => handleCancel(id)}
          onDelete={(id: string) => handleDelete(id)}
          onMarkPaid={(id: string) => handleMarkPaid(id)}
          onRefund={(id: string) => handleRefund(id)}
        />
      </div>

      {modalOrder && <OrderDetailsModal order={modalOrder} onClose={closeDetails} />}

      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
        />
      )}
    </div>
  );
};

export default OrderManagement;
