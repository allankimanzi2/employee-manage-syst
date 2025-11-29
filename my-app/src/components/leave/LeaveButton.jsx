// src/components/leave/LeaveButtons.jsx
import React from "react";

const LeaveButtons = ({ leaveId, onApprove, onReject }) => {
  return (
    <div className="flex gap-2">
      <button onClick={() => onApprove(leaveId)} className="bg-green-500 text-white px-2 py-1 rounded">
        Approve
      </button>
      <button onClick={() => onReject(leaveId)} className="bg-red-500 text-white px-2 py-1 rounded">
        Reject
      </button>
    </div>
  );
};

export default LeaveButtons;
