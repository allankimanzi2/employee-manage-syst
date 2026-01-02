import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import LeaveButtons from "./LeaveButton";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------
  // Fetch leave details
  // --------------------------
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/leave/detail/${id}`);

        if (res.data.success) {
          setLeave(res.data.leave);
          setError(null);
        } else {
          setError("Failed to load leave details");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch leave details");
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  // --------------------------
  // Change leave status
  // --------------------------
  const changeStatus = async (leaveId, status) => {
    try {
      const res = await API.put(`/leave/${leaveId}`, { status });
      if (res.data.success) navigate("/admin-dashboard/leaves");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update leave status");
    }
  };

  // --------------------------
  // Loading & Error states
  // --------------------------
  if (loading) {
    return <div className="text-center mt-10">Loading leave details...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>
    );
  }

  if (!leave || !leave.employeeId || !leave.employeeId.userId) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Leave details not available
      </div>
    );
  }

  // --------------------------
  // Render leave detail
  // --------------------------
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Leave Detail</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="flex justify-center">
          <img
            src={leave.employeeId.userId.profileImage || "/default-profile.png"}
            alt="Profile"
            className="rounded-full w-48 h-48 border"
          />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <DetailRow label="Name" value={leave.employeeId.userId.name} />
          <DetailRow label="Employee ID" value={leave.employeeId.employeeId} />
          <DetailRow label="Department" value={leave.employeeId.department?.dep_name || "N/A"} />
          <DetailRow label="Leave Type" value={leave.leaveType} />
          <DetailRow label="Reason" value={leave.reason} />
          <DetailRow label="From" value={new Date(leave.startDate).toLocaleDateString()} />
          <DetailRow label="To" value={new Date(leave.endDate).toLocaleDateString()} />
          <DetailRow label="Status" value={leave.status} />

          {leave.status === "Pending" && (
            <LeaveButtons
              leaveId={leave._id}
              status={leave.status}
              onApprove={(id) => changeStatus(id, "Approved")}
              onReject={(id) => changeStatus(id, "Rejected")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// --------------------------
// Reusable row component
// --------------------------
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b py-1">
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);

export default Detail;
