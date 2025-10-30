import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeesPage from './pages/admin/EmployeesPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import LeavePage from './pages/admin/LeavePage';
import SalaryPage from './pages/admin/SalaryPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminHome from './pages/admin/AdminHome'; // dashboard overview

function App() {
  return (
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




