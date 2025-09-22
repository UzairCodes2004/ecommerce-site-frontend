import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import ProductCard from "../../components/product/ProductCard";
import Rating from "../../components/product/Rating";
import useProductStore from "../../store/productStore";

const Products = () => {
  const {
    products,
    loading,
    error,
    filters,
    pagination,
    fetchProducts,
    setFilters,
  } = useProductStore();

  const [searchInput, setSearchInput] = useState(filters.keyword || "");

  //  Initial load - only once
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  //  search input when filters change (from other sources)
  useEffect(() => {
    setSearchInput(filters.keyword || "");
  }, [filters.keyword]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    setFilters({ keyword: searchInput, page: 1 }, { immediate: true });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage }, { immediate: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex w-full max-w-lg shadow-md rounded-2xl overflow-hidden bg-white transition-shadow duration-300 focus-within:shadow-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search products... (Press Enter to search)"
              value={searchInput}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-4 py-3 text-base text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={handleSearchSubmit}
              className="bg-blue-600 text-white px-6 py-3 font-semibold text-sm md:text-base rounded-r-2xl hover:bg-blue-700 active:bg-blue-800 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Status */}
        <div className="text-center text-sm text-gray-600 mb-4">
          {filters.keyword ? (
            <>
              Showing results for: <strong>"{filters.keyword}"</strong> |{" "}
            </>
          ) : (
            <>Showing all products | </>
          )}
          Found: <strong>{products.length} products</strong>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl text-gray-600">No products available</h2>
            <p className="text-gray-500">Check back later for new products</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product: any) => (
                <div key={product._id} className="flex flex-col">
                  {/* Existing Product Card */}
                  <ProductCard product={product} />

                  {/* ✅ Rating + Reviews under card */}
                  {/* <div className="mt-2 px-2">
                    <Rating
                      value={product.rating || 0}
                      text={
                        product.numReviews > 0
                          ? `${product.numReviews} reviews`
                          : "No reviews yet"
                      }
                    />
                  </div> */}
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded ${
                        pagination.page === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;