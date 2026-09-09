import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCalendarCheck,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";

import { useAuth } from "../../context/authContext";

const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-emerald-600 text-white shadow-md"
            : "text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col">

      {/* Logo */}
      <div className="h-20 border-b border-slate-800 flex flex-col justify-center px-6">
        <h1 className="text-2xl font-bold text-white">
          EmployeeMS
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Employee Portal
        </p>
      </div>

      {/* User */}
      <div className="px-5 py-5 border-b border-slate-800">
        <p className="text-sm text-slate-400">
          Signed in as
        </p>

        <p className="font-semibold text-white mt-1 truncate">
          {user?.name || "Employee"}
        </p>

        <p className="text-xs text-emerald-400 mt-1">
          Employee
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <SidebarLink
          to="/employee-dashboard"
          icon={<FaTachometerAlt />}
          label="Dashboard"
        />

        <SidebarLink
          to={`/employee-dashboard/profile/${user?._id}`}
          icon={<FaUser />}
          label="My Profile"
        />

        <SidebarLink
          to="/employee-dashboard/attendance"
          icon={<FaCalendarCheck />}
          label="My Attendance"
        />

<SidebarLink
  to={`/employee-dashboard/leaves/${user?._id}`}
  icon={<FaCalendarAlt />}
  label="My Leave"
/>

        <SidebarLink
          to={`/employee-dashboard/salary/${user?._id}`}
          icon={<FaMoneyBillWave />}
          label="My Salary"
        />

        <SidebarLink
          to="/employee-dashboard/settings"
          icon={<FaCog />}
          label="Settings"
        />

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} SmartJobs Ltd
        </p>
      </div>

    </div>
  );
};

export default Sidebar;