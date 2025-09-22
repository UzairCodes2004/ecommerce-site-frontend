// src/pages/customer/Profile.tsx
import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Profile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-600 text-lg font-medium">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        My Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
        <div className="space-y-2">
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-gray-900">Name:</span>{" "}
            {user.name}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-gray-900">Email:</span>{" "}
            {user.email}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition duration-200"
          >
            Edit Profile
          </Link>
          <Link
            to="/my-orders"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-gray-800 bg-gray-100 font-medium shadow-sm hover:bg-gray-200 hover:scale-105 transform transition duration-200"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
