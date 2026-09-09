import React, { useEffect, useState } from 'react';
import SummaryCard from "./SummaryCard";
import RecentEmployees from "./dashboard/RecentEmployees";
import LeaveRequests from "./dashboard/LeaveRequests";
import QuickActions from "./dashboard/QuickActions";
import DepartmentChart from "./dashboard/charts/DepartmentChart";
import EmployeeGrowthChart from "./dashboard/charts/EmployeeGrowthChart";
import ActivityFeed from "./dashboard/ActivityFeed";
import EmployeeAnalytics from "./dashboard/EmployeeAnalytics";
import WorkforceOverview from "./dashboard/WorkforceOverview";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

import API from "../../utils/api";

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const AdminSummary = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await API.get('/dashboard/summary');
        setDashboardData(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Unable to load dashboard summary.');
      }
    };

    fetchDashboardSummary();
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-6">Loading dashboard summary...</div>;
  }

  const { summary, leaveSummary, workforceOverview } = dashboardData;
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl font-semibold text-slate-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  // ==========================
  // Error Screen
  // ==========================

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div>

<h1 className="text-4xl font-bold text-slate-800">
    Dashboard
</h1>

<p className="text-slate-500 mt-2">
    Welcome back. Here's what's happening across your organization today.
</p>

</div>

<div className="mt-5 lg:mt-0">

<button
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
>
    Generate Report
</button>

</div>
</div>

      {/* Main Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <SummaryCard
    icon={<FaUsers />}
    text="Employees"
    number={summary?.totalEmployees || 0}
    color="bg-blue-600"
    trend="+12%"
/>

<SummaryCard
    icon={<FaBuilding />}
    text="Departments"
    number={summary?.totalDepartments || 0}
    color="bg-emerald-600"
    trend="+2%"
/>

<SummaryCard
    icon={<FaMoneyBillWave />}
    text="Monthly Payroll"
    number={`KSh ${(summary?.totalSalary || 0).toLocaleString()}`}
    color="bg-purple-600"
    trend="+8%"
/>

      </div>

      {/* Leave Summary */}

<div className="mt-12">

<div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold text-slate-800">
    Leave Management
  </h2>

  <span className="text-sm text-slate-500">
    Current Leave Status
  </span>

</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

  <SummaryCard
    icon={<FaFileAlt />}
    text="Applied"
    number={summary?.leaveSummary?.applied || 0}
    color="bg-blue-500"
    trend="+5%"
  />

  <SummaryCard
    icon={<FaCheckCircle />}
    text="Approved"
    number={summary?.leaveSummary?.approved || 0}
    color="bg-green-600"
    trend="+3%"
  />

  <SummaryCard
    icon={<FaHourglassHalf />}
    text="Pending"
    number={summary?.leaveSummary?.pending || 0}
    color="bg-amber-500"
    trend="-2%"
  />

  <SummaryCard
    icon={<FaTimesCircle />}
    text="Rejected"
    number={summary?.leaveSummary?.rejected || 0}
    color="bg-red-600"
    trend="-1%"
  />

</div>

</div>
<div className="mt-12">
    <WorkforceOverview />
</div>

      {/* Recent Employees & Leave Requests */}

      <div className="grid lg:grid-cols-2 gap-6 mt-12">

        <RecentEmployees
          employees={summary?.recentEmployees || []}
        />

        <LeaveRequests
          leaves={summary?.recentLeaves || []}
        />

      </div>
      <div className="mt-12">

    <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Employee Analytics
    </h2>

    <EmployeeAnalytics
        summary={summary}
    />

</div>

      {/* Department Chart */}

      {/* Analytics */}

      <div className="grid lg:grid-cols-3 gap-6 mt-10">

<div className="lg:col-span-2">

    <DepartmentChart
        data={summary?.departmentDistribution || []}
    />

</div>

<ActivityFeed />

</div>

<div className="mt-10">

<EmployeeGrowthChart
    data={summary?.employeeGrowth || []}
/>

</div>

      {/* Quick Actions */}

      <div className="mt-10">

        <QuickActions />

      </div>

    </div>
  );

export default AdminSummary;