import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Components
import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/dashboard/Navbar";

// Pages
import AdminHome from "./pages/admin/AdminHome";
import EmployeesPage from "./pages/admin/EmployeesPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import LeavePage from "./pages/admin/LeavePage";
import SalaryPage from "./pages/admin/SalaryPage";
import SettingsPage from "./pages/admin/SettingsPage";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin dashboard layout */}
        <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
          <Route index element={<AdminHome />} /> {/* Default page */}
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="salary" element={<SalaryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Optional: Add a fallback route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;





