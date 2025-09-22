export interface OrderItem {
  _id?: string;       // returned from backend
  name: string;
  image: string;
  price: number;
  product: string;    // backend expects productId here
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}
export interface Order {
  _id: string;
  user: string |{ _id: string; name?: string }; // always ID
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  isShipped: boolean;
  shippedAt?: string;
  isCancelled: boolean;
  cancelledAt?: string;
  isRefunded?: boolean;
  refundedAt?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}
