// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardCard from "../../components/admin/DashboardCard";

interface CardConfig {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  link: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect non-admins away
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
    } else {
      // Simulate loading delay for better UX
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // Card Config with only existing features
  const cards: CardConfig[] = [
    {
      title: "User Management",
      value: "Manage Users",
      icon: (
        <div className="p-3 bg-blue-500/20 rounded-2xl">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
      ),
      color: "bg-blue-50",
      gradient: "from-blue-50 to-blue-100",
      link: "/admin/users"
    },
    {
      title: "Product Management",
      value: "Manage Products",
      icon: (
        <div className="p-3 bg-green-500/20 rounded-2xl">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
      ),
      color: "bg-green-50",
      gradient: "from-green-50 to-green-100",
      link: "/admin/products"
    },
    {
      title: "Order Management",
      value: "Track Orders",
      icon: (
        <div className="p-3 bg-amber-500/20 rounded-2xl">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      ),
      color: "bg-amber-50",
      gradient: "from-amber-50 to-amber-100",
      link: "/admin/orders"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm h-40">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Welcome back, {user?.name}. Manage your store efficiently.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Current role</p>
              <p className="text-sm font-medium text-blue-600">Administrator</p>
            </div>
          </div>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              
              onClick={() => navigate(card.link)}
            />
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">Add Product</span>
            </button>
            
            <button 
              onClick={() => navigate('/admin/users')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">View Users</span>
            </button>
            
            <button 
              onClick={() => navigate('/admin/orders')}
              className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">View Orders</span>
            </button>
            
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">View Products</span>
            </button>
          </div>
        </div>

       
      </main>
    </div>
  );
};

export default Dashboard;