import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(response.data);

        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                width={40}
                height={40}
                className="rounded-full object-cover border border-gray-300"
                src={`http://localhost:5000/${emp.userId.profileImage}`}
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
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Define table columns here
  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.profileImage,
      width: "100px",
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "DOB",
      selector: (row) => row.dob,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      width: "250px",
    },
  ];

  // ✅ Handle search
  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.dep_name.toLowerCase().includes(value)
    );
    setFilteredEmployees(records);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-700">Manage Employee</h3>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search By Department"
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-md transition"
        >
          Add New Employee
        </Link>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredEmployee}
          progressPending={empLoading}
          pagination
          highlightOnHover
          responsive
          striped
        />
      </div>
    </div>
  );
};

export default List;
