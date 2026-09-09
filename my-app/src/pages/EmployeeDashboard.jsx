import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/EmployeeDashboard/Sidebar";
import Navbar from "../components/Navbar";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-40">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <section className="p-8">
          <Outlet />
        </section>

      </main>

    </div>
  );
};

export default EmployeeDashboard;