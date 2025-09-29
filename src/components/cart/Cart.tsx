// src/components/cart/Cart.tsx
import React from "react";
import useCartStore from "../../store/cartStore";
import { Link, useNavigate } from "react-router-dom";

interface CartItem {
  cartItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    total,
    itemCount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    forceClearAllCartData,
  } = useCartStore();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl sm:text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Your Shopping Cart
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
              Your cart is feeling lonely... Add some products!
            </p>
            <Link to="/products">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Cart Items
                </h2>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {items.map((item: CartItem) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-sm border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/80x80?text=Product";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="ml-4 sm:ml-6 flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 sm:truncate">
                        {item.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-base sm:text-lg">
                        ${item.price.toFixed(2)}
                      </p>

                   
                  
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 sm:space-x-3 mx-3 sm:mx-6">
                      <button
                        onClick={() => decreaseQuantity(item.cartItemId)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
                      >
                        <span className="text-lg sm:text-xl">−</span>
                      </button>
                      <span className="w-8 sm:w-12 text-center text-base sm:text-lg font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.cartItemId)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
                      >
                        <span className="text-lg sm:text-xl">+</span>
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-[70px] sm:min-w-[100px]">
                      <p className="text-base sm:text-xl font-bold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="ml-3 sm:ml-6 w-8 h-8 sm:w-10 sm:h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors duration-200"
                      title="Remove item"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4">
              <button
                onClick={forceClearAllCartData}
                className="px-4 py-2 sm:px-6 sm:py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium flex items-center space-x-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Clear Entire Cart</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mb-3 sm:mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link to="/products">
                <button className="w-full border-2 border-gray-300 text-gray-700 py-2 sm:py-3 rounded-xl font-medium hover:border-gray-400 transition-colors duration-200 text-sm sm:text-base">
                  Continue Shopping
                </button>
              </Link>

              {/* Security Badge */}
              <div className="mt-4 sm:mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-1 sm:mb-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">
                    Secure Checkout
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  All transactions are secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
