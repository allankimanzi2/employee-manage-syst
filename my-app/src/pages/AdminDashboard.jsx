import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}

      <main className="flex-1 lg:ml-64">

        <Navbar />

        <section className="p-8">

          {/* Welcome */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-800">
              Welcome back{user?.name ? `, ${user.name}` : ""} 👋
            </h1>

            <p className="text-slate-500 mt-2">
              Here's an overview of your organization today.
            </p>

          </div>

          {/* Current Page */}

          <Outlet />

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;