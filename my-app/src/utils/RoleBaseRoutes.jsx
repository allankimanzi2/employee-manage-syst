import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (!requiredRole.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (user.role === "employee") {
      return <Navigate to="/employee-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBaseRoutes;