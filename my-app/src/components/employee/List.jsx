import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import API from "../../utils/api";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);

      try {
        // Using the shared API instance (JWT is attached automatically)
        const response = await API.get("/employee");

        console.log(response.data);

        if (response.data.success) {
          let sno = 1;

          const data = response.data.employees.map((emp) => ({
            id: emp._id,
            sno: sno++,

            dep_name: emp.department?.dep_name || "N/A",

            name: emp.userId?.name || "N/A",

            dob: emp.dob
              ? new Date(emp.dob).toLocaleDateString()
              : "N/A",

            profileImage: (
              <img
                width={40}
                height={40}
                className="rounded-full object-cover border border-gray-300"
                src={
                  emp.userId?.profileImage
                    ? `https://employee-manage-syst.onrender.com/${emp.userId.profileImage}`
                    : "https://via.placeholder.com/40"
                }
                alt="profile"
              />
            ),

            action: <EmployeeButtons Id={emp._id} />,
          }));

          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        console.error(error);

        if (error.response) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    {
      name: "S/N",
      selector: (row) => row.sno,
      sortable: true,
      width: "80px",
    },
    {
      name: "Profile",
      cell: (row) => row.profileImage,
      width: "100px",
    },
    {
      name: "Employee",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.dob,
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "220px",
    },
  ];

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();

    const records = employees.filter((emp) =>
      emp.dep_name.toLowerCase().includes(value)
    );

    setFilteredEmployees(records);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Employees
        </h2>

        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Add Employee
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search department..."
          onChange={handleFilter}
          className="w-80 px-4 py-2 border rounded-lg"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployee}
        progressPending={empLoading}
        pagination
        striped
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default List;