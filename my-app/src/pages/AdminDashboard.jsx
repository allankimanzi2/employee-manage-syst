import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Components
import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar />

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
