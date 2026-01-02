// src/components/leave/LeaveButton.jsx
import React, { useState } from "react";

const LeaveButton = ({ leaveId, status = "Pending", onApprove, onReject }) => {
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Handle approve/reject click
  // --------------------------
  const handleAction = async (action) => {
    if (!action) return;
    setLoading(true);
    try {
      await action(leaveId);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Already approved/rejected
  // --------------------------
  if (status !== "Pending") {
    return (
      <span
        className={`px-3 py-1 rounded text-sm font-medium ${
          status === "Approved"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status}
      </span>
    );
  }

  // --------------------------
  // Pending buttons
  // --------------------------
  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction(onApprove)}
        disabled={loading}
        className={`px-3 py-1 rounded text-white ${
          loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {loading ? "Approving..." : "Approve"}
      </button>

      <button
        onClick={() => handleAction(onReject)}
        disabled={loading}
        className={`px-3 py-1 rounded text-white ${
          loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
};

export default LeaveButton;
