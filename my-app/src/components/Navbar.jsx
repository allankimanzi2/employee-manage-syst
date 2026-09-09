import React from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white h-20 shadow-sm border-b border-slate-200 px-8 flex items-center justify-between">

      {/* Left */}

      <div>

      <h2 className="text-2xl font-bold text-slate-800">
  {user?.role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
</h2>

        <p className="text-slate-500 text-sm mt-1">
          Welcome back, <span className="font-semibold">{user?.name}</span>
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="relative hidden md:block">

          <FaSearch className="absolute left-3 top-3 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

        </div>

        {/* Notifications */}

        <button className="relative w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">

          <FaBell className="text-slate-600" />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-4xl text-emerald-600" />

          <div className="hidden lg:block">

            <p className="font-semibold text-slate-800">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500 capitalize">
  {user?.role || "Employee"}
</p>

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </header>
  );
};

export default Navbar;