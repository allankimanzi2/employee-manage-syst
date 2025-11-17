import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { columns } from "../../utils/LeaveHelper";
import axios from "axios";
import LeaveButtons from "./LeaveButtons"; // adjust your path

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);

      if (response.data.success) {
        let sno = 1;

        const data = response.data.leaves.map((leave) => ({
          id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24),
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));

        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error fetching leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const text = e.target.value.toLowerCase();
    const filtered = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(text)
    );
    setFilteredLeaves(filtered);
  };

  const filterByButton = (status) => {
    const filtered = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(filtered);
  };

  if (!filteredLeaves) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Emp ID"
          className="px-4 py-1 border rounded"
          onChange={filterByInput}
        />

        <div className="space-x-3">
          <button
            className="px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={() => filterByButton("Pending")}
          >
            Pending
          </button>
          <button
            className="px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={() => filterByButton("Approved")}
          >
            Approved
          </button>
          <button
            className="px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={() => filterByButton("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeaves}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default Table;
