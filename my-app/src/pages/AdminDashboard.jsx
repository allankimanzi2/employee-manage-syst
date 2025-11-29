import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Components
import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/Navbar";

// Pages
import AdminHome from "./admin/AdminHome";
import EmployeesPage from "./admin/EmployeesPage";
import DepartmentsPage from "./admin/DepartmentsPage";
import LeavePage from "./admin/LeavePage";
import SalaryPage from "./admin/SalaryPage";
import SettingsPage from "./admin/SettingsPage";

// ✅ Layout for Admin Dashboard
const AdminDashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <Navbar />
        <div className="p-6">
          <Outlet /> {/* Nested routes will render here */}
        </div>
      </div>
    </div>
  );
};

// ✅ Only export layout here; routing happens in App.jsx or top-level router
export default AdminDashboardLayout;
