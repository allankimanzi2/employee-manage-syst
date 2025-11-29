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
import { useAuth } from "../../context/authContext";


/** Reusable Sidebar Link */
const SidebarLink = ({ to, icon, label }) => {
  if (!to || !label) return null;

  return (
    <NavLink
      to={to}
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

/** Main Sidebar Component */
const Sidebar = () => {
  const { user } = useAuth() || {}; // get user safely
  if (!user) {
    return (
      <aside className="bg-gray-900 text-gray-400 h-screen flex items-center justify-center">
        <p>Loading user data...</p>
      </aside>
    );
  }

  // ✅ Define isAdmin BEFORE return
  const isAdmin = user.role === "admin";

  return (
    <aside className="bg-gray-900 text-gray-200 h-screen fixed left-0 top-0 w-64 shadow-lg flex flex-col">
      
      {/* Header */}
      <div className="bg-emerald-600 h-16 flex items-center justify-center shadow-md">
        <h3 className="text-2xl font-bold text-white">Employee MS</h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 space-y-1 px-3">
        {isAdmin ? (
          <>
            <SidebarLink to="/admin-dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
            <SidebarLink to="/admin-dashboard/employees" icon={<FaUsers />} label="Employees" />
            <SidebarLink to="/admin-dashboard/departments" icon={<FaBuilding />} label="Departments" />
            <SidebarLink to="/admin-dashboard/leave" icon={<FaCalendarAlt />} label="Leave" />
            <SidebarLink to="/admin-dashboard/salary" icon={<FaMoneyBillWave />} label="Salary" />
            <SidebarLink to="/admin-dashboard/settings" icon={<FaCogs />} label="Settings" />
          </>
        ) : (
          <>
            <SidebarLink to="/employee-dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
            <SidebarLink
              to={`/employee-dashboard/profile/${user._id || "unknown"}`}
              icon={<FaUsers />}
              label="My Profile"
            />
            <SidebarLink
              to={`/employee-dashboard/leaves/${user._id || "unknown"}`}
              icon={<FaCalendarAlt />}
              label="Leaves"
            />
            <SidebarLink
              to={`/employee-dashboard/salary/${user._id || "unknown"}`}
              icon={<FaMoneyBillWave />}
              label="Salary"
            />
            <SidebarLink to="/employee-dashboard/setting" icon={<FaCogs />} label="Settings" />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="bg-gray-800 text-center py-3 text-sm text-gray-400">
        © {new Date().getFullYear()} EmployeeMS
      </div>
    </aside>
  );
};

export default Sidebar;
