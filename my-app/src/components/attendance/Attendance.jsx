import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaSync,
} from "react-icons/fa";

import API from "../../utils/api";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [employeesResponse, attendanceResponse] = await Promise.all([
        API.get("/employee"),
        API.get("/attendance/today"),
      ]);

      if (employeesResponse.data.success) {
        setEmployees(employeesResponse.data.employees || []);
      }

      if (attendanceResponse.data.success) {
        setAttendance(attendanceResponse.data.attendance || []);
      }
    } catch (err) {
      console.error("Attendance fetch error:", err);

      setError(
        err.response?.data?.error ||
          "Unable to load today's attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAttendance = (employeeId) => {
    return attendance.find(
      (record) =>
        record.employeeId?._id === employeeId ||
        record.employeeId === employeeId
    );
  };

  const handleCheckIn = async (employeeId, workMode = "On-site") => {
    setProcessingId(employeeId);
    setError("");

    try {
      await API.post("/attendance/check-in", {
        employeeId,
        workMode,
      });

      await fetchData();
    } catch (err) {
      console.error("Check-in error:", err);

      setError(
        err.response?.data?.error ||
          "Unable to check employee in."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckOut = async (employeeId) => {
    setProcessingId(employeeId);
    setError("");

    try {
      await API.post("/attendance/check-out", {
        employeeId,
      });

      await fetchData();
    } catch (err) {
      console.error("Check-out error:", err);

      setError(
        err.response?.data?.error ||
          "Unable to check employee out."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (record) => {
    if (!record) {
      return {
        label: "Not Checked In",
        className: "bg-slate-100 text-slate-600",
      };
    }

    if (record.status === "On Leave") {
      return {
        label: "On Leave",
        className: "bg-amber-100 text-amber-700",
      };
    }

    if (record.checkOut) {
      return {
        label: "Checked Out",
        className: "bg-blue-100 text-blue-700",
      };
    }

    return {
      label: record.workMode === "Remote" ? "Remote" : "Present",
      className:
        record.workMode === "Remote"
          ? "bg-purple-100 text-purple-700"
          : "bg-emerald-100 text-emerald-700",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FaCalendarCheck className="text-emerald-600 text-2xl" />

            <h2 className="text-2xl font-bold text-slate-800">
              Attendance
            </h2>
          </div>

          <p className="text-slate-500 mt-1">
            Manage today's employee attendance and work status.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-slate-500">Total Employees</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {employees.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-slate-500">Present / Remote</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {
              attendance.filter(
                (item) =>
                  item.status === "Present"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-slate-500">Remote</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {
              attendance.filter(
                (item) =>
                  item.status === "Present" &&
                  item.workMode === "Remote"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-slate-500">Not Checked In</p>
          <p className="text-3xl font-bold text-slate-600 mt-2">
            {Math.max(employees.length - attendance.length, 0)}
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Today's Attendance
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading attendance...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-sm text-slate-600">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Work Mode</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => {
                  const record = getAttendance(employee._id);
                  const status = getStatus(record);
                  const isProcessing =
                    processingId === employee._id;

                  return (
                    <tr
                      key={employee._id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {employee.userId?.name || "Unknown"}
                        </div>

                        <div className="text-xs text-slate-500">
                          {employee.employeeId}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {employee.department?.dep_name || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {record?.workMode || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <FaSignInAlt className="text-emerald-500" />
                          {formatTime(record?.checkIn)}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <FaSignOutAlt className="text-blue-500" />
                          {formatTime(record?.checkOut)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {!record ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              disabled={isProcessing}
                              onClick={() =>
                                handleCheckIn(
                                  employee._id,
                                  "On-site"
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Processing..."
                                : "On-site"}
                            </button>

                            <button
                              disabled={isProcessing}
                              onClick={() =>
                                handleCheckIn(
                                  employee._id,
                                  "Remote"
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50"
                            >
                              Remote
                            </button>
                          </div>
                        ) : !record.checkOut &&
                          record.status === "Present" ? (
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleCheckOut(employee._id)
                            }
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Check Out"}
                          </button>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <FaClock />
        Attendance records are based on today's check-in and check-out activity.
      </div>
    </div>
  );
};

export default Attendance;
