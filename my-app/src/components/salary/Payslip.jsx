import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";

const Payslip = () => {
  const { salaryId } = useParams();
  const navigate = useNavigate();

  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH VERIFIED PAYSLIP
  // ============================================================

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        setLoading(true);
        setError("");

        if (!salaryId) {
          throw new Error("Salary ID not found");
        }

        // IMPORTANT:
        // This endpoint performs the backend authorization checks.
        // It verifies:
        // 1. Salary exists
        // 2. Payroll is Paid
        // 3. Admin is allowed OR employee owns the payroll
        const response = await API.get(
          `/salary/payslip/${salaryId}`
        );

        if (!response.data.success || !response.data.salary) {
          throw new Error(
            response.data.error ||
              "Failed to load payslip"
          );
        }

        setSalary(response.data.salary);
      } catch (err) {
        console.error("Payslip error:", err);

        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load payslip"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayslip();
  }, [salaryId]);

  // ============================================================
  // FORMAT MONEY
  // ============================================================

  const money = (value) => {
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) return "-";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ============================================================
  // PRINT
  // ============================================================

  const printPayslip = () => {
    window.print();
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-600">
          Loading payslip...
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!salary) {
    return null;
  }

  // ============================================================
  // EMPLOYEE DATA
  // ============================================================

  const employee = salary.employeeId;
  const employeeUser = employee?.userId;

  const employeeName =
    employeeUser?.name ||
    employee?.name ||
    "Employee";

  const employeeNumber =
    employee?.employeeId || "-";

  const employeeEmail =
    employeeUser?.email ||
    employee?.email ||
    "-";

  const department =
    employee?.department?.dep_name ||
    employee?.department?.name ||
    employee?.dep_name ||
    "-";

  // ============================================================
  // PAYSLIP
  // ============================================================

  return (
    <div className="bg-gray-100 min-h-screen p-5">

      {/* ======================================================
          ACTION BAR
      ======================================================= */}

      <div className="max-w-4xl mx-auto mb-5 flex justify-between print:hidden">

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          ← Back
        </button>

        <button
          onClick={printPayslip}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md font-semibold"
        >
          🖨 Print Payslip
        </button>

      </div>

      {/* ======================================================
          PAYSLIP DOCUMENT
      ======================================================= */}

      <div
        id="payslip"
        className="
          max-w-4xl
          mx-auto
          bg-white
          shadow-md
          rounded-lg
          overflow-hidden
        "
      >

        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="bg-teal-700 text-white px-8 py-6">

          <div className="flex justify-between items-center gap-6">

            <div>

              <h1 className="text-3xl font-bold">
                PAYSLIP
              </h1>

              <p className="text-teal-100 mt-1">
                SmartJobs Ltd
              </p>

              <p className="text-sm text-teal-200 mt-1">
                Employee Management & Payroll System
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-teal-100">
                Payroll Period
              </p>

              <p className="text-xl font-bold">
                {salary.payrollMonth}{" "}
                {salary.payrollYear}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            EMPLOYEE INFORMATION
        ===================================================== */}

        <div className="px-8 py-6 border-b">

          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Employee Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Employee Name
              </p>

              <p className="font-semibold text-gray-800">
                {employeeName}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Employee ID
              </p>

              <p className="font-semibold text-gray-800">
                {employeeNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Department
              </p>

              <p className="font-semibold text-gray-800">
                {department}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Email
              </p>

              <p className="font-semibold text-gray-800">
                {employeeEmail}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Payment Date
              </p>

              <p className="font-semibold text-gray-800">
                {formatDate(salary.payDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Payroll Status
              </p>

              <span
                className="
                  inline-block
                  mt-1
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold
                  bg-green-100
                  text-green-700
                "
              >
                {salary.status}
              </span>
            </div>

          </div>

        </div>

        {/* ====================================================
            EARNINGS
        ===================================================== */}

        <div className="px-8 py-6">

          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
            Earnings
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Basic Salary
              </span>

              <span className="font-medium">
                KSh {money(salary.basicSalary)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Allowances
              </span>

              <span className="font-medium">
                KSh {money(salary.allowances)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Lunch Allowance
              </span>

              <span className="font-medium">
                KSh {money(salary.lunchAllowance)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Trip Earnings
              </span>

              <span className="font-medium">
                KSh {money(salary.tripEarnings)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Overtime
              </span>

              <span className="font-medium">
                KSh {money(salary.overtime)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Bonuses
              </span>

              <span className="font-medium">
                KSh {money(salary.bonuses)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Other Earnings
              </span>

              <span className="font-medium">
                KSh {money(salary.otherEarnings)}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
              <span>
                Gross Salary
              </span>

              <span>
                KSh {money(salary.grossSalary)}
              </span>
            </div>

          </div>

        </div>

        {/* ====================================================
            EMPLOYEE DEDUCTIONS
        ===================================================== */}

        <div className="px-8 py-6 bg-gray-50">

          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
            Employee Deductions
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-600">
                NSSF
              </span>

              <span>
                KSh {money(salary.nssf)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                SHIF
              </span>

              <span>
                KSh {money(salary.shif)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Housing Levy
              </span>

              <span>
                KSh {money(salary.housingLevy)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                PAYE
              </span>

              <span>
                KSh {money(salary.paye)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Salary Advance
              </span>

              <span>
                KSh {money(salary.advanceDeductions)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Loan Deductions
              </span>

              <span>
                KSh {money(salary.loanDeductions)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Incident Deductions
              </span>

              <span>
                KSh {money(salary.incidentDeductions)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Other Deductions
              </span>

              <span>
                KSh {money(salary.otherDeductions)}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-red-600">
              <span>
                Total Deductions
              </span>

              <span>
                KSh {money(salary.deductions)}
              </span>
            </div>

          </div>

        </div>

        {/* ====================================================
            NET SALARY
        ===================================================== */}

        <div className="mx-8 my-8 bg-teal-50 border border-teal-200 rounded-lg p-6">

          <div className="flex justify-between items-center gap-5">

            <div>

              <p className="text-sm text-teal-700 font-medium">
                NET SALARY
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Amount payable to employee
              </p>

            </div>

            <p className="text-3xl font-bold text-teal-700">
              KSh {money(salary.netSalary)}
            </p>

          </div>

        </div>

        {/* ====================================================
            EMPLOYER CONTRIBUTIONS
        ===================================================== */}

        <div className="px-8 pb-8">

          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
            Employer Contributions
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Employer NSSF
              </span>

              <span>
                KSh {money(salary.employerNssf)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Employer Housing Levy
              </span>

              <span>
                KSh {money(salary.employerHousingLevy)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                NITA
              </span>

              <span>
                KSh {money(salary.nita)}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>
                Total Employer Contributions
              </span>

              <span>
                KSh {money(
                  salary.totalEmployerContributions
                )}
              </span>
            </div>

            <div className="flex justify-between font-bold text-gray-800">
              <span>
                Total Payroll Cost
              </span>

              <span>
                KSh {money(
                  salary.totalPayrollCost
                )}
              </span>
            </div>

          </div>

        </div>

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <div className="bg-gray-50 border-t px-8 py-5 text-center">

          <p className="text-xs text-gray-500">
            This payslip was generated by the
            SmartJobs Ltd Employee Management
            & Payroll System.
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Please retain this document for your records.
          </p>

        </div>

      </div>

      {/* ======================================================
          PRINT STYLES
      ======================================================= */}

      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }

            body {
              background: white !important;
            }

            #payslip {
              max-width: none !important;
              width: 100% !important;
              margin: 0 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            #payslip * {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>

    </div>
  );
};

export default Payslip;