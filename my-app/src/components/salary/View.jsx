import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/authContext";

const View = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ============================================================
  // FETCH SALARIES
  // ============================================================

  const fetchSalaries = async () => {
    try {
      setError(null);

      const response = await API.get(`/salary/${id}`);

      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      } else {
        setError("Failed to load salary data.");
      }
    } catch (err) {
      console.error("Salary fetch error:", err);

      setError(
        err.response?.data?.error ||
          "Network error. Please try again."
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchSalaries();
    }
  }, [user]);

  // ============================================================
  // SEARCH
  // ============================================================

  const filterSalaries = (e) => {
    const q = e.target.value.toLowerCase();

    const filtered = salaries.filter((salary) => {
      const employeeId =
        salary.employeeId?.employeeId?.toLowerCase() || "";

      const month =
        salary.payrollMonth?.toLowerCase() || "";

      const year =
        String(salary.payrollYear || "");

      return (
        employeeId.includes(q) ||
        month.includes(q) ||
        year.includes(q)
      );
    });

    setFilteredSalaries(filtered);
  };

  // ============================================================
  // FORMAT MONEY
  // ============================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // ============================================================
  // OPEN PAYSLIP
  //
  // The dedicated Payslip.jsx page is responsible for:
  // 1. Backend authorization
  // 2. Paid-status verification
  // 3. Displaying the complete payslip
  // 4. Printing the payslip
  // ============================================================

  const openPayslip = (salary) => {
    if (!salary) {
      return;
    }

    if (salary.status !== "Paid") {
      alert(
        "This payslip is not available yet. Payroll must be marked as Paid first."
      );
      return;
    }

    navigate(
      `/admin-dashboard/employees/salary/${id}/payslip/${salary._id}`
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (!user) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="overflow-x-auto p-5">

      {/* ======================================================
          TITLE
      ======================================================= */}

      <div className="text-center">

        <h2 className="text-2xl font-bold">
          Salary History
        </h2>

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <p className="text-red-600 text-center my-3 font-semibold">
          {error}
        </p>
      )}

      {/* ======================================================
          SEARCH
      ======================================================= */}

      <div className="flex justify-end my-3">

        <input
          type="text"
          placeholder="Search by Emp ID, Month or Year"
          className="
            border
            px-3
            rounded-md
            py-2
            border-gray-300
          "
          onChange={filterSalaries}
        />

      </div>

      {/* ======================================================
          SALARY TABLE
      ======================================================= */}

      {filteredSalaries.length > 0 ? (

        <table
          className="
            w-full
            text-sm
            text-left
            text-gray-500
          "
        >

          <thead
            className="
              text-xs
              text-gray-700
              uppercase
              bg-gray-50
              border
              border-gray-200
            "
          >

            <tr>

              <th className="px-6 py-3">
                SNO
              </th>

              <th className="px-6 py-3">
                Emp ID
              </th>

              <th className="px-6 py-3">
                Period
              </th>

              <th className="px-6 py-3">
                Basic Salary
              </th>

              <th className="px-6 py-3">
                Allowance
              </th>

              <th className="px-6 py-3">
                Deduction
              </th>

              <th className="px-6 py-3">
                Net Salary
              </th>

              <th className="px-6 py-3">
                Status
              </th>

              <th className="px-6 py-3">
                Pay Date
              </th>

              <th className="px-6 py-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredSalaries.map(
              (salary, index) => (

                <tr
                  key={salary._id}
                  className="
                    bg-white
                    border-b
                  "
                >

                  {/* SNO */}

                  <td className="px-6 py-3">
                    {index + 1}
                  </td>

                  {/* EMPLOYEE ID */}

                  <td className="px-6 py-3">
                    {salary.employeeId?.employeeId ||
                      "N/A"}
                  </td>

                  {/* PERIOD */}

                  <td className="px-6 py-3">
                    {salary.payrollMonth}{" "}
                    {salary.payrollYear}
                  </td>

                  {/* BASIC SALARY */}

                  <td className="px-6 py-3">
                    KSh{" "}
                    {formatMoney(
                      salary.basicSalary
                    )}
                  </td>

                  {/* ALLOWANCES */}

                  <td className="px-6 py-3">
                    KSh{" "}
                    {formatMoney(
                      salary.allowances
                    )}
                  </td>

                  {/* DEDUCTIONS */}

                  <td className="px-6 py-3">
                    KSh{" "}
                    {formatMoney(
                      salary.deductions
                    )}
                  </td>

                  {/* NET SALARY */}

                  <td className="px-6 py-3 font-semibold">
                    KSh{" "}
                    {formatMoney(
                      salary.netSalary
                    )}
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-3">

                    <span
                      className={`
                        px-2
                        py-1
                        rounded
                        text-xs
                        font-semibold

                        ${
                          salary.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : salary.status === "Processed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {salary.status}
                    </span>

                  </td>

                  {/* PAY DATE */}

                  <td className="px-6 py-3">

                    {salary.payDate
                      ? new Date(
                          salary.payDate
                        ).toLocaleDateString()
                      : "N/A"}

                  </td>

                  {/* ACTION */}

                  <td className="px-6 py-3">

                    <button
                      onClick={() =>
                        openPayslip(salary)
                      }
                      disabled={
                        salary.status !== "Paid"
                      }
                      title={
                        salary.status !== "Paid"
                          ? "Payslip becomes available after payroll is marked Paid"
                          : "View and print payslip"
                      }
                      className="
                        bg-teal-600
                        hover:bg-teal-700
                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                        text-white
                        px-3
                        py-2
                        rounded
                        text-xs
                        font-semibold
                      "
                    >

                      {salary.status !== "Paid"
                        ? "Not Available"
                        : "🧾 View Payslip"}

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      ) : (

        <div className="text-center mt-5">
          No Records Found
        </div>

      )}

    </div>
  );
};

export default View;
