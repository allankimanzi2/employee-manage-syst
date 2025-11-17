import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Columns configuration for DataTable
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
    width: "100px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "120px",
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

// ✅ Fetch all departments with proper error handling
export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:5000/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      return response.data.departments;
    } else {
      console.error("Failed to fetch departments:", response.data.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    alert(error.response?.data?.error || "Network error while fetching departments");
    return [];
  }
};

// ✅ Fetch employees by department ID with error handling
export const getEmployees = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      return response.data.employees;
    } else {
      console.error("Failed to fetch employees:", response.data.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    alert(error.response?.data?.error || "Network error while fetching employees");
    return [];
  }
};

// ✅ Employee action buttons component
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

