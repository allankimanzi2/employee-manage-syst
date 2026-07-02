import API from "./api";
import { useNavigate } from "react-router-dom";

// ==============================
// DataTable Columns
// ==============================
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "120px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "150px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

// ==============================
// Fetch Departments
// ==============================
export const fetchDepartments = async () => {
  try {
    const response = await API.get("/department");

    if (response.data.success) {
      return response.data.departments;
    }

    console.error(response.data.error);
    return [];
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.error ||
        "Failed to fetch departments."
    );
    return [];
  }
};

// ==============================
// Fetch Employees by Department
// ==============================
export const getEmployees = async (id) => {
  try {
    const response = await API.get(`/employee/department/${id}`);

    if (response.data.success) {
      return response.data.employees;
    }

    console.error(response.data.error);
    return [];
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.error ||
        "Failed to fetch employees."
    );
    return [];
  }
};

// ==============================
// Employee Action Buttons
// ==============================
export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
      >
        View
      </button>

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        Edit
      </button>

      <button
        className="px-3 py-1 bg-yellow-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
      >
        Salary
      </button>

      <button
        className="px-3 py-1 bg-red-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
      >
        Leave
      </button>
    </div>
  );
};