// src/components/layout/Navigation.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-gray-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded ${
                isActive("/")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-4 py-2 rounded ${
                isActive("/products")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`px-4 py-2 rounded ${
                  isActive("/profile")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded ${
                  isActive("/admin")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Desktop Navigation (hidden on mobile) */}
      <nav className="hidden md:flex space-x-6">
        <Link
          to="/"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive("/")
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          }`}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive("/products")
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          }`}
        >
          Products
        </Link>
        {user && (
          <Link
            to="/profile"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/profile")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            Profile
          </Link>
        )}
        {user?.isAdmin && (
          <Link
            to="/admin"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/admin")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            Admin
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navigation;