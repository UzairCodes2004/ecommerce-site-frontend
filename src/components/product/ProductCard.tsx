// src/components/product/ProductCard.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import Rating from "./Rating"; // ✅ make sure Rating.tsx is in same folder (src/components/product/Rating.tsx)

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }

    addToCart({
      ...product,
      quantity: 1,
      cartItemId: product._id,
    });
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden group transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] backdrop-blur-sm">
      <Link to={`/product/${product._id}`} className="block relative h-full">
        {/* Image Container */}
        <div className="overflow-hidden relative bg-black">
          <img
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            className="w-full h-64 object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10 bg-white group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:to-gray-100 transition-colors duration-500 rounded-b-3xl flex flex-col h-72">
          <div className="flex-1">
            <h3 className="font-semibold text-xl tracking-tight mb-2 line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors duration-500">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors duration-500">
              {product.description}
            </p>

            {/* ✅ Rating Section */}
            <div className="mb-3">
              {product.numReviews && product.numReviews > 0 ? (
                <Rating
                  value={product.rating || 0}
                  text={`${product.numReviews} review${
                    product.numReviews > 1 ? "s" : ""
                  }`}
                />
              ) : (
                <span className="text-gray-500 text-sm">No reviews yet</span>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors duration-500">
                ${product.price.toFixed(2)}
              </span>
              <span
                className={`px-3 py-1 text-xs rounded-full shadow-sm tracking-wide transition-all duration-500 ${
                  product.countInStock > 0
                    ? "bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:text-green-900"
                    : "bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:text-red-900"
                }`}
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-500 ease-out transform relative z-20 ${
                product.countInStock > 0
                  ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
              }`}
            >
              {product.countInStock > 0 ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add to Cart
                </span>
              ) : (
                "Out of Stock"
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;