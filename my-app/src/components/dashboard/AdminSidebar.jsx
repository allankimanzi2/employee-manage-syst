import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-gray-900 text-gray-200 h-screen fixed left-0 top-0 bottom-0 w-64 shadow-lg flex flex-col">
      
      {/* Logo */}
      <div className="bg-emerald-600 h-16 flex items-center justify-center shadow-md">
        <h3 className="text-2xl font-bold tracking-wide text-white">
          Employee MS
        </h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 space-y-1 px-3">
        <SidebarLink to="/admin-dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
        <SidebarLink to="/admin-dashboard/employees" icon={<FaUsers />} label="Employees" />
        <SidebarLink to="/admin-dashboard/departments" icon={<FaBuilding />} label="Departments" />
        <SidebarLink to="/admin-dashboard/leave" icon={<FaCalendarAlt />} label="Leave" />
        <SidebarLink to="/admin-dashboard/salary" icon={<FaMoneyBillWave />} label="Salary" />
        <SidebarLink to="/admin-dashboard/settings" icon={<FaCogs />} label="Settings" />
      </nav>

      {/* Footer */}
      <div className="bg-gray-800 text-center py-3 text-sm text-gray-400">
        © {new Date().getFullYear()} EmployeeMS
      </div>
    </div>
  );
};

// ----------------------------
// Sidebar Link Component
// ----------------------------
const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
          isActive
            ? "bg-emerald-600 text-white font-semibold shadow-md"
            : "hover:bg-gray-800 hover:text-emerald-400"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="text-base">{label}</span>
    </NavLink>
  );
};

export default AdminSidebar;

