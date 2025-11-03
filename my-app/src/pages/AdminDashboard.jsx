import React from 'react';
import { useAuth } from '../context/authContext';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import AdminSummary from '../components/dashboard/AdminSummary';
import { Outlet } from 'react-router-dom';
 import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeesPage from './pages/admin/EmployeesPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import LeavePage from './pages/admin/LeavePage';
import SalaryPage from './pages/admin/SalaryPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminHome from './pages/admin/AdminHome'; // dashboard overview

const AdminDashboard = () => {
  const {user} = useAuth()
}
function App() {
  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar/>
        <Outlet/>
      </div>
    </div>
    <BrowserRouter>
      <Routes>
        {/* Admin dashboard layout */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} /> {/* Default inside dashboard */}
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="salary" element={<SalaryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;




