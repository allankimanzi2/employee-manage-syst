import { useNavigate } from "react-router-dom";

// ✅ Columns configuration for DataTable
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Emp ID",
    selector: (row) => row.employeeId,
    width: "120px",
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "170px",
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "80px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "120px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true, // boolean, not string
  },
];

// ✅ Leave action button component
export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  // Handle navigation safely
  const handleView = (id) => {
    if (!id) {
      console.error("Invalid leave ID");
      alert("Cannot view leave: Invalid ID");
      return;
    }
    try {
      navigate(`/admin-dashboard/leaves/${id}`);
    } catch (err) {
      console.error("Navigation error:", err);
      alert("Failed to navigate. Please try again.");
    }
  };

  return (
    <button
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
      onClick={() => handleView(Id)}
    >
      View
    </button>
  );
};
