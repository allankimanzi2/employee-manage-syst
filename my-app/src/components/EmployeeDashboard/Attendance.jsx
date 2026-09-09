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
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/attendance/my/today");

      if (response.data.success) {
        setAttendance(response.data.attendance);
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
    fetchAttendance();
  }, []);

  const handleCheckIn = async (workMode) => {
    setProcessing(true);
    setError("");

    try {
      const response = await API.post(
        "/attendance/my/check-in",
        {
          workMode,
        }
      );

      if (response.data.success) {
        setAttendance(response.data.attendance);
      }
    } catch (err) {
      console.error("Check-in error:", err);

      setError(
        err.response?.data?.error ||
          "Unable to check in."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setProcessing(true);
    setError("");

    try {
      const response = await API.post(
        "/attendance/my/check-out"
      );

      if (response.data.success) {
        setAttendance(response.data.attendance);
      }
    } catch (err) {
      console.error("Check-out error:", err);

      setError(
        err.response?.data?.error ||
          "Unable to check out."
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateHours = () => {
    if (!attendance?.checkIn) {
      return "0h 00m";
    }

    const start = new Date(attendance.checkIn);

    const end = attendance.checkOut
      ? new Date(attendance.checkOut)
      : new Date();

    const difference = end - start;

    if (difference < 0) {
      return "0h 00m";
    }

    const totalMinutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  const getStatus = () => {
    if (!attendance) {
      return {
        label: "Not Checked In",
        className:
          "bg-slate-100 text-slate-700",
      };
    }

    if (attendance.checkOut) {
      return {
        label: "Checked Out",
        className:
          "bg-blue-100 text-blue-700",
      };
    }

    return {
      label:
        attendance.workMode === "Remote"
          ? "Working Remotely"
          : "Present",
      className:
        attendance.workMode === "Remote"
          ? "bg-purple-100 text-purple-700"
          : "bg-emerald-100 text-emerald-700",
    };
  };

  const status = getStatus();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <FaCalendarCheck className="text-emerald-600 text-2xl" />

            <h1 className="text-3xl font-bold text-slate-800">
              My Attendance
            </h1>

          </div>

          <p className="text-slate-500 mt-2">
            Track your attendance and working hours.
          </p>
        </div>

        <button
          onClick={fetchAttendance}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition"
        >
          <FaSync
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}


      {/* Today's summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

          <p className="text-sm text-slate-500">
            Today's Status
          </p>

          <div className="mt-3">
            <span
              className={`px-3 py-2 rounded-full text-sm font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

        </div>


        {/* Working hours */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Working Hours
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-2">
                {calculateHours()}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaClock className="text-blue-600 text-xl" />
            </div>

          </div>

        </div>


        {/* Work mode */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

          <p className="text-sm text-slate-500">
            Work Mode
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {attendance?.workMode || "—"}
          </p>

        </div>

      </div>


      {/* Attendance card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="px-6 py-5 border-b">

          <h2 className="text-xl font-bold text-slate-800">
            Today's Attendance
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString(
              undefined,
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>

        </div>


        <div className="p-6">

          {loading ? (

            <div className="text-center py-10 text-slate-500">
              Loading attendance...
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Check In */}
              <div className="bg-slate-50 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <FaSignInAlt className="text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Check In
                    </p>

                    <p className="text-xl font-bold text-slate-800">
                      {formatTime(
                        attendance?.checkIn
                      )}
                    </p>
                  </div>

                </div>

              </div>


              {/* Check Out */}
              <div className="bg-slate-50 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FaSignOutAlt className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Check Out
                    </p>

                    <p className="text-xl font-bold text-slate-800">
                      {formatTime(
                        attendance?.checkOut
                      )}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          )}


          {/* Actions */}
          {!loading && (

            <div className="mt-8">

              {!attendance ? (

                <div>

                  <p className="text-slate-600 mb-4">
                    You haven't checked in today.
                  </p>

                  <div className="flex flex-wrap gap-3">

                    <button
                      disabled={processing}
                      onClick={() =>
                        handleCheckIn("On-site")
                      }
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                      <FaSignInAlt />

                      {processing
                        ? "Processing..."
                        : "Check In — On-site"}
                    </button>


                    <button
                      disabled={processing}
                      onClick={() =>
                        handleCheckIn("Remote")
                      }
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                      <FaSignInAlt />

                      Check In — Remote
                    </button>

                  </div>

                </div>

              ) : !attendance.checkOut ? (

                <div>

                  <p className="text-slate-600 mb-4">
                    You are currently checked in.
                  </p>

                  <button
                    disabled={processing}
                    onClick={handleCheckOut}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    <FaSignOutAlt />

                    {processing
                      ? "Processing..."
                      : "Check Out"}
                  </button>

                </div>

              ) : (

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700">
                  Your attendance for today is complete.
                </div>

              )}

            </div>

          )}

        </div>

      </div>


      {/* Information */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <FaClock />

        Working hours are calculated from your check-in
        until your check-out time.
      </div>

    </div>
  );
};

export default Attendance;