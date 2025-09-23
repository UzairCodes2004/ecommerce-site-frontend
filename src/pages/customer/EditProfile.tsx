// src/pages/customer/EditProfile.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

interface UpdateProfileForm {
  name: string;
  password: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore(); // Use authStore actions
  const [form, setForm] = useState<UpdateProfileForm>({
    name: user?.name || "",
    password: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
    if (error) clearError();
  };

  // In EditProfile.tsx - remove the token expectation
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      await updateProfile(form);
      navigate("/profile"); // ✅ stay logged in, just go back to profile
    } catch (err: any) {
      console.error("Profile update error:", err);
      setLocalError("Profile update failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      {/* Display errors from store or local component */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {localError && <p className="text-red-500 mb-4">{localError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New Password (leave blank to keep current)
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          disabled={isLoading}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
