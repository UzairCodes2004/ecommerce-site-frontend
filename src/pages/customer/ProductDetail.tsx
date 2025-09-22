import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../../store/productStore";
import useCartStore from "../../store/cartStore";
import Rating from "../../components/product/Rating";
import productService, {
  Review as ServiceReview,
  CreateReviewData,
} from "../../services/productService";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  reviews?: Review[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, fetchProductById, loading, error } =
    useProductStore();
  const { addToCart } = useCartStore();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [purchaseCheckError, setPurchaseCheckError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  useEffect(() => {
    // Check if user has PAID for this product
    const checkUserPurchase = async () => {
      if (token && id) {
        setCheckingPurchase(true);
        setPurchaseCheckError("");
        try {
          const res = await productService.checkPurchase(id);
          setIsPaid(res.isPaid === true);
        } catch (error: any) {
          setPurchaseCheckError("Failed to verify payment status");
          setIsPaid(false);
        } finally {
          setCheckingPurchase(false);
        }
      } else {
        setIsPaid(false);
      }
    };

    checkUserPurchase();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
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
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
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
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(currentProduct as any, quantity);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) return;
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setReviewSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const reviewData: CreateReviewData = { rating, comment };
      await productService.createProductReview(id!, reviewData, token);

      setComment("");
      setRating(0);

      // 🔄 Re-fetch latest product with reviews
      await fetchProductById(id!);

      setSuccessMessage("Review submitted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= currentProduct.countInStock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <button
                onClick={() => navigate("/products")}
                className="hover:text-blue-600 transition-colors"
              >
                Products
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">
                {currentProduct.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-center">
            <div className="relative w-full h-96">
              <img
                src={currentProduct.image || "/images/placeholder.jpg"}
                alt={currentProduct.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/400x400?text=Product+Image";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {currentProduct.name}
              </h1>

              {/* Rating */}
              <div className="mb-6">
                <Rating
                  value={currentProduct.rating || 0}
                  text={
                    (currentProduct.numReviews || 0) > 0
                      ? `${currentProduct.numReviews} review${
                          currentProduct.numReviews !== 1 ? "s" : ""
                        }`
                      : "No reviews yet"
                  }
                />
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-emerald-600 mb-6">
                ${currentProduct.price.toFixed(2)}
              </p>

              {/* Extra details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Brand:</span>
                    <p className="text-gray-800">{currentProduct.brand}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Category:</span>
                    <p className="text-gray-800 capitalize">
                      {currentProduct.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Availability:
                    </span>
                    <p
                      className={
                        currentProduct.countInStock > 0
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {currentProduct.countInStock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">SKU:</span>
                    <p className="text-gray-800">
                      {currentProduct._id?.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg">−</span>
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= currentProduct.countInStock}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={currentProduct.countInStock === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  currentProduct.countInStock > 0
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } shadow-lg`}
              >
                {currentProduct.countInStock > 0 ? (
                  <span className="flex items-center justify-center gap-2">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add to Cart - $
                    {(currentProduct.price * quantity).toFixed(2)}
                  </span>
                ) : (
                  "Out of Stock"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <Rating
                value={currentProduct.rating || 0}
                text={`Based on ${currentProduct.numReviews || 0} reviews`}
              />
            </div>
          </div>

          {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProduct.reviews.map((review: ServiceReview) => (
                <div
                  key={review._id || Math.random()}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {review.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <Rating value={review.rating} text="" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Write a Review
          </h2>

          {/* Messages */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
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
                <span className="text-green-800">{successMessage}</span>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0极"
                  />
                </svg>
                <span className="text-red-800">{errorMessage}</span>
              </div>
            </div>
          )}
          {purchaseCheckError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-yellow-800">{purchaseCheckError}</span>
              </div>
            </div>
          )}

          {token ? (
            checkingPurchase ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  Verifying your payment status...
                </div>
              </div>
            ) : isPaid ? (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= rating ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {rating}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Comment *
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setComment(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    rows={4}
                    placeholder="Share your experience with this product. What did you like or dislike?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting || !rating || !comment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Review...
                    </div>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-600 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Review Policy
                    </h3>
                    <p className="text-blue-700">
                      You can only review products you have purchased and paid
                      for.
                    </p>
                    {/* <p className="text-blue-600 mt-2 text-sm">
                      Current payment status:{" "}
                      <strong>{isPaid ? "Paid" : "Not Paid"}</strong>
                    </p> */}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-gray-700 mb-4">
                Please sign in to write a review for products you've purchased.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
