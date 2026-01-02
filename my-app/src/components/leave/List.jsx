import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import API from "../../utils/api";
import LeaveButton from "./LeaveButton";

const List = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaves from API
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/leave/${id}/${user.role}`);
      if (res.data.success) setLeaves(res.data.leaves);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user?.role) fetchLeaves();
  }, [id, user?.role]);

  // Update leave status
  const changeStatus = async (leaveId, status) => {
    try {
      const res = await API.put(`/leave/${leaveId}`, { status });
      if (res.data.success) {
        // Update the leaves array locally without refetching
        setLeaves((prev) =>
          prev.map((l) =>
            l._id === leaveId ? { ...l, status: status } : l
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update leave status");
    }
  };

  // Callback when a new leave is added
  const handleLeaveAdded = (newLeave) => {
    setLeaves((prev) => [...prev, newLeave]);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      {/* Add leave button for employees */}
      {user.role === "employee" && (
        <Link
          to="/employee-dashboard/add-leave"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 mb-4 inline-block"
        >
          Add Leave
        </Link>
      )}

      {/* Leaves Table */}
      <table className="w-full border text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">From</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">Status</th>
            {user.role === "admin" && <th className="px-4 py-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={user.role === "admin" ? 6 : 5} className="text-center py-4">
                No leave requests found
              </td>
            </tr>
          ) : (
            leaves.map((l, i) => (
              <tr
                key={l._id}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{l.leaveType}</td>
                <td className="px-4 py-2">
                  {new Date(l.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(l.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{l.status}</td>
                {user.role === "admin" && (
                  <td className="px-4 py-2">
                    <LeaveButton
                      leaveId={l._id}
                      status={l.status}
                      onApprove={(id) => changeStatus(id, "Approved")}
                      onReject={(id) => changeStatus(id, "Rejected")}
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
