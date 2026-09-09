import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import API from "../../utils/api";
import LeaveButton from "./LeaveButton";

const List = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/leave/${id}/${user.role}`
      );

      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error("Fetch leaves error:", err);

      alert(
        err.response?.data?.error ||
          "Failed to fetch leave requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user?.role) {
      fetchLeaves();
    }
  }, [id, user?.role]);

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const changeStatus = async (leaveId, status) => {
    try {
      const res = await API.put(
        `/leave/${leaveId}`,
        { status }
      );

      if (res.data.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === leaveId
              ? {
                  ...leave,
                  status,
                }
              : leave
          )
        );
      }
    } catch (err) {
      console.error("Update leave error:", err);

      alert(
        err.response?.data?.error ||
          "Failed to update leave status"
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-500">
          Loading leave requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {user.role === "employee"
              ? "My Leave"
              : "Employee Leave"}
          </h1>

          <p className="text-slate-500 mt-2">
            View and manage leave requests.
          </p>
        </div>

        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="inline-flex items-center justify-center px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
          >
            + Request Leave
          </Link>
        )}

      </div>

      {/* Summary */}
{user.role === "employee" && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Total Requests */}
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Total Requests
      </p>

      <p className="text-3xl font-bold text-slate-800 mt-2">
        {leaves.length}
      </p>
    </div>

    {/* Pending */}
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Pending
      </p>

      <p className="text-3xl font-bold text-yellow-600 mt-2">
        {
          leaves.filter(
            (leave) => leave.status === "Pending"
          ).length
        }
      </p>
    </div>

    {/* Approved */}
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Approved
      </p>

      <p className="text-3xl font-bold text-emerald-600 mt-2">
        {
          leaves.filter(
            (leave) => leave.status === "Approved"
          ).length
        }
      </p>
    </div>

  </div>
)}

      {/* Leave table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  #
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Leave Type
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  From
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  To
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Days
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>

                {user.role === "admin" && (
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Action
                  </th>
                )}

              </tr>

            </thead>

            <tbody>

              {leaves.length === 0 ? (

                <tr>

                  <td
                    colSpan={
                      user.role === "admin"
                        ? 7
                        : 6
                    }
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No leave requests found.
                  </td>

                </tr>

              ) : (

                leaves.map((leave, index) => (

                  <tr
                    key={leave._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-800">
                        {leave.leaveType}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(
                        leave.startDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(
                        leave.endDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {calculateDays(
                        leave.startDate,
                        leave.endDate
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>

                    </td>

                    {user.role === "admin" && (

                      <td className="px-6 py-4">

                        <LeaveButton
                          leaveId={leave._id}
                          status={leave.status}
                          onApprove={(leaveId) =>
                            changeStatus(
                              leaveId,
                              "Approved"
                            )
                          }
                          onReject={(leaveId) =>
                            changeStatus(
                              leaveId,
                              "Rejected"
                            )
                          }
                        />

                      </td>

                    )}

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default List;