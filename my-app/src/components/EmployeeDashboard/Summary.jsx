import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaSync,
} from "react-icons/fa";

import { useAuth } from "../../context/authContext";
import API from "../../utils/api";

const Summary = () => {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [attendanceError, setAttendanceError] = useState("");
  const [processing, setProcessing] = useState(false);

  // ============================================================
  // FETCH TODAY'S ATTENDANCE
  // ============================================================

  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    setAttendanceError("");

    try {
      const response = await API.get("/attendance/my/today");

      if (response.data.success) {
        setAttendance(response.data.attendance);
      }
    } catch (error) {
      console.error("Summary attendance error:", error);

      setAttendanceError(
        error.response?.data?.error ||
          "Unable to load attendance."
      );
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ============================================================
  // CHECK IN
  // ============================================================

  const handleCheckIn = async (workMode = "On-site") => {
    setProcessing(true);
    setAttendanceError("");

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
    } catch (error) {
      console.error("Check-in error:", error);

      setAttendanceError(
        error.response?.data?.error ||
          "Unable to check in."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ============================================================
  // CHECK OUT
  // ============================================================

  const handleCheckOut = async () => {
    setProcessing(true);
    setAttendanceError("");

    try {
      const response = await API.post(
        "/attendance/my/check-out"
      );

      if (response.data.success) {
        setAttendance(response.data.attendance);
      }
    } catch (error) {
      console.error("Check-out error:", error);

      setAttendanceError(
        error.response?.data?.error ||
          "Unable to check out."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // CALCULATE WORKING HOURS
  // ============================================================

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

  // ============================================================
  // ATTENDANCE STATUS
  // ============================================================

  const getAttendanceStatus = () => {
    if (!attendance) {
      return {
        label: "Not Checked In",
        className: "text-slate-800",
        badgeClass:
          "bg-slate-100 text-slate-700",
      };
    }

    if (attendance.checkOut) {
      return {
        label: "Checked Out",
        className: "text-blue-700",
        badgeClass:
          "bg-blue-100 text-blue-700",
      };
    }

    if (attendance.workMode === "Remote") {
      return {
        label: "Working Remotely",
        className: "text-purple-700",
        badgeClass:
          "bg-purple-100 text-purple-700",
      };
    }

    return {
      label: "Present",
      className: "text-emerald-700",
      badgeClass:
        "bg-emerald-100 text-emerald-700",
    };
  };

  const attendanceStatus = getAttendanceStatus();

  return (
    <div>

      {/* ======================================================
          WELCOME
      ====================================================== */}

      <div className="mb-8">
        <p className="text-slate-500 text-sm">
          Employee Portal
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          Welcome back, {user?.name || "Employee"} 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Here's your work overview for today.
        </p>
      </div>


      {/* ======================================================
          ATTENDANCE ERROR
      ====================================================== */}

      {attendanceError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {attendanceError}
        </div>
      )}


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Attendance */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Today's Attendance
              </p>

              <h2
                className={`text-2xl font-bold mt-2 ${attendanceStatus.className}`}
              >
                {loadingAttendance
                  ? "Loading..."
                  : attendanceStatus.label}
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                {attendance?.checkIn
                  ? `Checked in at ${formatTime(
                      attendance.checkIn
                    )}`
                  : "Attendance status"}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FaCalendarCheck />
            </div>

          </div>

        </div>


        {/* Working Hours */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Working Hours
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                {loadingAttendance
                  ? "Loading..."
                  : calculateHours()}
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                Today's hours
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaClock />
            </div>

          </div>

        </div>


        {/* Leave */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Leave Requests
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                0
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                Pending requests
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <FaCalendarAlt />
            </div>

          </div>

        </div>


        {/* Salary */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Latest Salary
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                KSh 0
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                Net salary
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaMoneyBillWave />
            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          LOWER SECTION
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


        {/* ====================================================
            TODAY'S ATTENDANCE
        ==================================================== */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-bold text-slate-800">
                Today's Attendance
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Track your working day
              </p>

            </div>

            <button
              onClick={fetchAttendance}
              disabled={loadingAttendance}
              className="text-slate-500 hover:text-slate-800 transition"
              title="Refresh attendance"
            >
              <FaSync
                className={
                  loadingAttendance
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </div>


          <div className="bg-slate-50 rounded-xl p-5">

            {loadingAttendance ? (

              <p className="text-slate-500">
                Loading attendance...
              </p>

            ) : (

              <>

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Status
                    </p>

                    <p className="font-semibold text-slate-800 mt-1">
                      {attendanceStatus.label}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-2 rounded-full text-xs font-semibold ${attendanceStatus.badgeClass}`}
                  >
                    {attendance?.workMode || "Not checked in"}
                  </span>

                </div>


                {/* Times */}

                <div className="grid grid-cols-2 gap-4 mt-5">

                  <div className="bg-white rounded-xl p-4">

                    <div className="flex items-center gap-2 text-emerald-600">

                      <FaSignInAlt />

                      <span className="text-sm font-medium">
                        Check In
                      </span>

                    </div>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {formatTime(
                        attendance?.checkIn
                      )}
                    </p>

                  </div>


                  <div className="bg-white rounded-xl p-4">

                    <div className="flex items-center gap-2 text-blue-600">

                      <FaSignOutAlt />

                      <span className="text-sm font-medium">
                        Check Out
                      </span>

                    </div>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {formatTime(
                        attendance?.checkOut
                      )}
                    </p>

                  </div>

                </div>


                {/* Actions */}

                <div className="mt-5">

                  {!attendance ? (

                    <div>

                      <p className="text-sm text-slate-600 mb-3">
                        You haven't checked in today.
                      </p>

                      <div className="flex flex-wrap gap-3">

                        <button
                          disabled={processing}
                          onClick={() =>
                            handleCheckIn("On-site")
                          }
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
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
                          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                        >
                          <FaSignInAlt />

                          Check In — Remote
                        </button>

                      </div>

                    </div>

                  ) : !attendance.checkOut ? (

                    <div>

                      <p className="text-sm text-slate-600 mb-3">
                        You are currently checked in.
                      </p>

                      <button
                        disabled={processing}
                        onClick={handleCheckOut}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                      >
                        <FaSignOutAlt />

                        {processing
                          ? "Processing..."
                          : "Check Out"}
                      </button>

                    </div>

                  ) : (

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700 text-sm">
                      Your attendance for today is complete.
                    </div>

                  )}

                </div>

              </>

            )}

          </div>

        </div>


        {/* ====================================================
            PROFILE
        ==================================================== */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center gap-4 mb-6">

            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
              <FaUser />
            </div>

            <div>

              <h2 className="font-bold text-slate-800">
                {user?.name || "Employee"}
              </h2>

              <p className="text-sm text-slate-500">
                {user?.email}
              </p>

            </div>

          </div>


          <div className="space-y-3">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Role
              </span>

              <span className="font-medium capitalize">
                {Array.isArray(user?.role)
                  ? user.role.join(", ")
                  : user?.role || "Employee"}
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-500">
                Account
              </span>

              <span className="text-emerald-600 font-medium">
                Active
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-500">
                Work Mode
              </span>

              <span className="font-medium text-slate-700">
                {attendance?.workMode || "—"}
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-500">
                Today's Hours
              </span>

              <span className="font-medium text-slate-700">
                {calculateHours()}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          INFORMATION
      ====================================================== */}

      <div className="flex items-center gap-2 text-sm text-slate-500 mt-6">
        <FaClock />

        Working hours are calculated from your check-in
        until your check-out time.
      </div>

    </div>
  );
};

export default Summary;