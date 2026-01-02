import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { columns } from "../../utils/LeaveHelper";
import LeaveButton from "./LeaveButton";
import API from "../../utils/api";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leave"); // ✅ use API instance

      if (res.data.success) {
        let sno = 1;

        const data = res.data.leaves.map((leave) => ({
          id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId?.name || "N/A",
          leaveType: leave.leaveType,
          department: leave.employeeId?.department?.dep_name || "N/A",
          days:
            Math.ceil(
              (new Date(leave.endDate) - new Date(leave.startDate)) /
                (1000 * 60 * 60 * 24)
            ) || 1,
          status: leave.status,
          action: (
            <LeaveButton
              leaveId={leave._id}
              status={leave.status}
              onApprove={(id) => updateStatus(id, "Approved")}
              onReject={(id) => updateStatus(id, "Rejected")}
            />
          ),
        }));

        setLeaves(data);
        setFilteredLeaves(data);
      } else {
        setError("Failed to load leaves");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  // Update leave status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leave/${id}`, { status }); // ✅ use API instance
      fetchLeaves(); // Refresh table after status update
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter by employee ID
  const filterByInput = (e) => {
    const text = e.target.value.toLowerCase();
    setFilteredLeaves(
      leaves.filter((l) => l.employeeId.toLowerCase().includes(text))
    );
  };

  // Filter by status
  const filterByStatus = (status) => {
    setFilteredLeaves(
      leaves.filter((l) => l.status.toLowerCase() === status.toLowerCase())
    );
  };

  if (loading) return <div className="p-6 text-center">Loading leaves...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-center mb-6">Manage Leaves</h3>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Employee ID"
          className="px-4 py-2 border rounded"
          onChange={filterByInput}
        />

        <div className="space-x-2">
          <button
            onClick={() => filterByStatus("Pending")}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Pending
          </button>
          <button
            onClick={() => filterByStatus("Approved")}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Approved
          </button>
          <button
            onClick={() => filterByStatus("Rejected")}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Rejected
          </button>
          <button
            onClick={() => setFilteredLeaves(leaves)}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            All
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeaves}
        pagination
        highlightOnHover
        striped
        noDataComponent="No leave records found"
      />
    </div>
  );
};

export default Table;
