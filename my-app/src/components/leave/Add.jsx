import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import API from "../../utils/api";

const Add = ({ onLeaveAdded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leave, setLeave] = useState({
    employeeId: user?._id || "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await API.post("/leave/add", leave);

      if (res.data.success) {
        // Option 1: Call parent callback if provided
        if (onLeaveAdded) onLeaveAdded(res.data.leave);

        // Option 2: Navigate to list (existing behavior)
        navigate(`/employee-dashboard/leaves/${user._id}`);
      }
    } catch (error) {
      console.error("Add leave error:", error);
      alert(error.response?.data?.error || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request for Leave</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={leave.leaveType}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              name="startDate"
              value={leave.startDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              name="endDate"
              value={leave.endDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="reason"
            value={leave.reason}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            placeholder="Reason for leave"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-2 px-4 rounded-md text-white font-bold 
            ${loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"}`}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
};

export default Add;
