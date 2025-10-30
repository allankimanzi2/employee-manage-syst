import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';

import DepartmentList from './components/department/DepartmentList';
import AdminSummary from './components/AdminSummary';
import AddDepartment from './components/department/AddDepartment'; 
import EditDepartment from './pages/EditDepartment';

import List from './components/employee/List';
import Add from './components/employee/Add';
import View from './components/employee/View';
import Edit from './components/employee/Edit';
import AddSalary from './components/salary/Add'
import ViewSalary from './components/salary/View';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />
          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/:id" element={<Edit />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />
          <Route path="salary/:id" element={<AddSalary  />} />
        </Route>

        {/* Employee Protected Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
