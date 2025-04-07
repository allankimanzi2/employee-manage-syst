import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBuilding,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt
} from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-Pacific">Employee MS</h3>
      </div>
      <div className="mt-4">
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `${isActive ? 'bg-teal-500' : ''} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? 'bg-teal-500' : ''} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>Employees</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${isActive ? 'bg-teal-500' : ''} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaBuilding />
          <span>Departments</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/leave"
          className={({ isActive }) =>
            `${isActive ? 'bg-teal-500' : ''} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCalendarAlt />
          <span>Leave</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary"
          className={({ isActive }) =>
            `${isActive ? 'bg-teal-500' : ''} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) =>
            `${isActive ? 'bg-teal-500' : ''} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCogs />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
