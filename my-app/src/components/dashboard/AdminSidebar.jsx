import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
FaClipboardCheck,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-900 text-slate-200 flex flex-col shadow-2xl">

      {/* Logo */}

      <div className="h-20 border-b border-slate-800 flex flex-col justify-center px-6">

        <h1 className="text-2xl font-bold text-white">
          EmployeeMS
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          HR Management Platform
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        <SidebarLink
          to="/admin-dashboard"
          icon={<FaTachometerAlt />}
          label="Dashboard"
        />

        <SidebarLink
          to="/admin-dashboard/employees"
          icon={<FaUsers />}
          label="Employees"
        />

        <SidebarLink
          to="/admin-dashboard/departments"
          icon={<FaBuilding />}
          label="Departments"
        />

        <SidebarLink
          to="/admin-dashboard/leaves"
          icon={<FaCalendarAlt />}
          label="Leave Management"
        />
        <SidebarLink
  to="/admin-dashboard/attendance"
  icon={<FaClipboardCheck />}
  label="Attendance"
/>

        <SidebarLink
          to="/admin-dashboard/salary/add"
          icon={<FaMoneyBillWave />}
          label="Payroll"
        />

        <SidebarLink
          to="/admin-dashboard/reports"
          icon={<FaChartBar />}
          label="Reports"
        />

        <SidebarLink
          to="/admin-dashboard/settings"
          icon={<FaCog />}
          label="Settings"
        />

      </nav>

      {/* Bottom */}

      <div className="border-t border-slate-800 p-5">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition">

          <FaSignOutAlt />

          Logout

        </button>

        <p className="text-xs text-slate-500 mt-5 text-center">
          © {new Date().getFullYear()} EmployeeMS
        </p>

      </div>

    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-emerald-600 text-white shadow-lg"
          : "hover:bg-slate-800 hover:text-emerald-400"
      }`
    }
  >
    <span className="text-lg">{icon}</span>

    <span className="font-medium">{label}</span>
  </NavLink>
);

export default AdminSidebar;
