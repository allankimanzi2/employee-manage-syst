import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const response = await API.get("/leave");

      if (response.data.success) {
        const pending = response.data.leaves.filter(
          (leave) => leave.status === "Pending"
        );

        setRequests(pending.slice(0, 5));
      }
    } catch (error) {
      console.error(
        "Failed to fetch pending leaves:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Pending Leave
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Leave requests awaiting approval
          </p>
        </div>

        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          {requests.length}
        </span>

      </div>

      {loading ? (

        <p className="text-slate-500">
          Loading requests...
        </p>

      ) : requests.length === 0 ? (

        <div className="bg-slate-50 rounded-xl p-5 text-center">
          <p className="text-slate-500">
            No pending leave requests.
          </p>
        </div>

      ) : (

        <div className="space-y-3">

          {requests.map((leave) => (

            <div
              key={leave._id}
              className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
            >

              <div>

                <p className="font-semibold text-slate-800">
                  {leave.employeeId?.userId?.name ||
                    "Employee"}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {leave.leaveType}
                </p>

              </div>

              <span className="text-yellow-600 font-semibold text-sm">
                Pending
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default LeaveRequests;