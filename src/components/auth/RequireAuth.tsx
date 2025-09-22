// src/components/auth/RequireAuth.tsx
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "Please log in to continue. If you don't have an account, register first.",
        }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;