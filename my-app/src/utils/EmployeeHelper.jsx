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
    width: "150px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    sortable: true,
    width: "160px",
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

// =====================================
// Fetch All Departments
// =====================================
export const fetchDepartments = async () => {
  const response = await API.get("/department");

  if (response.data.success) {
    return response.data.departments;
  }

  return [];
};

// =====================================
// Fetch Employees By Department
// =====================================
export const getEmployees = async (departmentId) => {
  try {
    const { data } = await API.get(
      `/employee/department/${departmentId}`
    );

    if (data.success) {
      return data.employees;
    }

    return [];
  } catch (err) {
    console.error("Employee Error:", err);

    return [];
  }
};

// =====================================
// Action Buttons
// =====================================
export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <button
        className="bg-teal-600 text-white px-3 py-1 rounded"
        onClick={() =>
          navigate(`/admin-dashboard/employees/${Id}`)
        }
      >
        View
      </button>

      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() =>
          navigate(`/admin-dashboard/employees/${Id}/edit`)
        }
      >
        Edit
      </button>

      <button
        className="bg-yellow-600 text-white px-3 py-1 rounded"
        onClick={() =>
          navigate(`/admin-dashboard/employees/salary/${Id}`)
        }
      >
        Salary
      </button>

      <button
        className="bg-red-600 text-white px-3 py-1 rounded"
        onClick={() =>
          navigate(`/admin-dashboard/employees/leave/${Id}`)
        }
      >
        Leave
      </button>
    </div>
  );
};