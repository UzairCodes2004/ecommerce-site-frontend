// src/pages/customer/Checkout.tsx
import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";
import type { OrderData } from "../../services/orderService";
import { OrderItem } from "../../types/order";

const PAYMENT_METHODS = ["Credit Card", "PayPal", "Stripe", "Cash on Delivery"];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, total, clearCart } = useCartStore();

  // selector for placeOrder and loading
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const loading = useOrderStore((s) => s.loading);

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");
  const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>(
    {}
  );
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1); // Track current step

  // Update progress based on form completion
  // In the useEffect hook where the error occurs:

useEffect(() => {
  // Check if shipping is complete
  const isShippingComplete = 
    shipping.address && 
    shipping.city && 
    shipping.postalCode && 
    shipping.country;
  
  // Check if payment is complete based on method - FIXED TYPE
  let isPaymentComplete = false;
  
  if (paymentMethod === "Credit Card") {
    isPaymentComplete = Boolean(
      paymentDetails.cardNumber && 
      paymentDetails.expiry && 
      paymentDetails.cvc
    );
  } else if (paymentMethod === "PayPal") {
    isPaymentComplete = Boolean(paymentDetails.paypalEmail);
  } else if (paymentMethod === "Stripe") {
    isPaymentComplete = Boolean(paymentDetails.stripeId);
  } else if (paymentMethod === "Cash on Delivery") {
    isPaymentComplete = true; // No details needed
  }

  // Update current step
  if (isShippingComplete && isPaymentComplete) {
    setCurrentStep(3); // Ready to place order
  } else if (isShippingComplete) {
    setCurrentStep(2); // Shipping complete, payment needed
  } else {
    setCurrentStep(1); // Still on shipping
  }
}, [shipping, paymentMethod, paymentDetails]);

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });

  const validate = () => {
    if (
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode ||
      !shipping.country
    ) {
      setError("Please fill all shipping fields.");
      return false;
    }
    if (!paymentMethod) {
      setError("Please choose a payment method.");
      return false;
    }
    if (paymentMethod === "Credit Card") {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiry ||
        !paymentDetails.cvc
      ) {
        setError("Please fill all credit card details.");
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setError(null);
    if (!validate()) return;

    // Ensure prices are valid numbers
    const itemsPrice = Number(total) || 0;
    const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Use the correct field names that your backend expects
    const orderItems: OrderItem[] = items.map((i: any) => ({
      name: i.name,
      image: i.image,
      price: Number(i.price) || 0,
      product: i._id,                
      qty: i.quantity || i.qty || 1, 
    }));

    const shippingAddress = {
      address: shipping.address,
      city: shipping.city,
      postalCode: shipping.postalCode,
      country: shipping.country,
    };

    const payload: OrderData = {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
    };

    try {
      setLocalLoading(true);
      const result = await placeOrder(payload);
      clearCart();
      navigate("/thank-you", { state: { order: result } });
    } catch (err: any) {
      console.error("Order placement failed:", err);
      setError(err?.message || "Failed to place order");
    } finally {
      setLocalLoading(false);
    }
  };

  // Order breakdown for display only
  const itemsPrice = Number(total ?? 0);
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const shippingPrice = 0;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
              
              {/* Progress Indicator - NOW UPDATES IN REAL TIME */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-2 ${
                      currentStep >= 1 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      1
                    </div>
                    <span className={`font-medium ${
                      currentStep >= 1 ? "text-gray-800" : "text-gray-500"
                    }`}>
                      Shipping
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-2 ${
                      currentStep >= 2 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      2
                    </div>
                    <span className={`font-medium ${
                      currentStep >= 2 ? "text-gray-800" : "text-gray-500"
                    }`}>
                      Payment
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-2 ${
                      currentStep >= 3 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      3
                    </div>
                    <span className={`font-medium ${
                      currentStep >= 3 ? "text-gray-800" : "text-gray-500"
                    }`}>
                      Confirmation
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      name="address"
                      value={shipping.address}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      name="city"
                      value={shipping.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      name="postalCode"
                      value={shipping.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      name="country"
                      value={shipping.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </h2>
                <select
                  value={paymentMethod}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setPaymentMethod(e.target.value);
                    setPaymentDetails({});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors mb-4"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {paymentMethod === "Credit Card" && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        name="cardNumber"
                        value={paymentDetails.cardNumber || ""}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          name="expiry"
                          value={paymentDetails.expiry || ""}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                        <input
                          name="cvc"
                          value={paymentDetails.cvc || ""}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "PayPal" && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email</label>
                    <input
                      name="paypalEmail"
                      value={paymentDetails.paypalEmail || ""}
                      onChange={handlePaymentChange}
                      placeholder="email@example.com"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                )}

                {paymentMethod === "Stripe" && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Account ID</label>
                    <input
                      name="stripeId"
                      value={paymentDetails.stripeId || ""}
                      onChange={handlePaymentChange}
                      placeholder="acct_123456789"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                )}

                {paymentMethod === "Cash on Delivery" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800">Pay with cash when your order is delivered</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="mb-6">
                {items.map((item: any) => (
                  <div key={item.cartItemId} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={localLoading || currentStep < 3}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  localLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : currentStep < 3
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
                } text-white shadow-lg`}
              >
                {localLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </div>
                ) : currentStep < 3 ? (
                  "Complete Form to Continue"
                ) : (
                  "Place Order"
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500">All transactions are secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;