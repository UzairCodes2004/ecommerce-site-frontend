import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Cart from "./components/cart/Cart";
import Checkout from "./pages/customer/Checkout";
import ThankYou from "./pages/customer/ThankYou";
import Profile from "./pages/customer/Profile";
import EditProfile from "./pages/customer/EditProfile";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetail from "./pages/customer/OrderDetail";
import RequireAuth from "./components/auth/RequireAuth";
import { ToastProvider } from "./contexts/ToastContext";
import ProductDetails from "./pages/customer/ProductDetail";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UsersManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrdersManagement";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Cart + Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* Profile + Orders */}
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <RequireAuth>
                  <EditProfile />
                </RequireAuth>
              }
            />
            <Route
              path="/my-orders"
              element={
                <RequireAuth>
                  <MyOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <RequireAuth>
                  <OrderDetail />
                </RequireAuth>
              }
            />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Admin routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route
              path="/admin/users"
              element={
                <RequireAuth>
                  <UserManagement />
                </RequireAuth>
              }
            />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
