import React, { useEffect, useMemo, useState } from "react";
import API from "../../utils/api";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STATUS_OPTIONS = ["Pending", "Processed", "Paid"];

const EMPTY_SUMMARY = {
  employeeCount: 0,
  grossSalary: 0,
  basicSalary: 0,
  allowances: 0,
  lunchDays: 0,
  lunchAllowance: 0,
  tripEarnings: 0,
  overtime: 0,
  bonuses: 0,
  otherEarnings: 0,
  nssf: 0,
  shif: 0,
  housingLevy: 0,
  paye: 0,
  advance: 0,
  advanceDeductions: 0,
  loanDeductions: 0,
  incidentDeductions: 0,
  otherDeductions: 0,
  totalDeductions: 0,
  netSalary: 0,
  employerNssf: 0,
  employerHousingLevy: 0,
  nita: 0,
  totalEmployerContributions: 0,
  totalPayrollCost: 0,
};

const EMPTY_STATUS_SUMMARY = {
  Pending: 0,
  Processed: 0,
  Paid: 0,
};

const PayrollReports = () => {
  const currentYear = new Date().getFullYear();

  const [salaries, setSalaries] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [statusSummary, setStatusSummary] = useState(EMPTY_STATUS_SUMMARY);
  const [departmentBreakdown, setDepartmentBreakdown] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filters, setFilters] = useState({
    month: "all",
    year: currentYear,
    status: "all",
    department: "all",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatEmployeeName = (employee) => {
    if (!employee) return "Unknown Employee";
  
    return employee.userId?.name || "Unknown Employee";
  };
  
  const getEmployeeNumber = (employee) => {
    if (!employee) return "—";
  
    return employee.employeeId || "—";
  };

  const getDepartmentName = (employee) => {
    if (!employee?.department) return "Unassigned";

    if (typeof employee.department === "string") {
      return employee.department;
    }

    return employee.department.dep_name || "Unassigned";
  };

  const formatPeriod = (salary) => {
    if (!salary) return "—";

    return `${salary.payrollMonth || "—"} ${salary.payrollYear || ""}`.trim();
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Processed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/department");

      if (response.data.success) {
        setDepartments(response.data.departments || []);
      }
    } catch (err) {
      console.error("Department fetch error:", err);
    }
  };

  const fetchReport = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (activeFilters.month !== "all") {
        params.append("month", activeFilters.month);
      }

      if (activeFilters.year) {
        params.append("year", activeFilters.year);
      }

      if (activeFilters.status !== "all") {
        params.append("status", activeFilters.status);
      }

      if (activeFilters.department !== "all") {
        params.append("department", activeFilters.department);
      }

      const query = params.toString();

      const response = await API.get(
        `/salary/reports${query ? `?${query}` : ""}`
      );

      if (response.data.success) {
        setSalaries(response.data.salaries || []);
        setSummary({
          ...EMPTY_SUMMARY,
          ...(response.data.summary || {}),
        });

        setStatusSummary({
          ...EMPTY_STATUS_SUMMARY,
          ...(response.data.statusSummary || {}),
        });

        setDepartmentBreakdown(response.data.departmentBreakdown || []);
      } else {
        setError("Failed to load payroll report.");
      }
    } catch (err) {
      console.error("Payroll report error:", err);

      setError(
        err.response?.data?.error ||
          "Failed to load payroll report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchReport();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    fetchReport(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      month: "all",
      year: currentYear,
      status: "all",
      department: "all",
    };

    setFilters(defaultFilters);
    fetchReport(defaultFilters);
  };

  const reportLabel = useMemo(() => {
    const month =
      filters.month === "all" ? "All Months" : filters.month;

    const year = filters.year || "All Years";

    return `${month} ${year}`;
  }, [filters]);

  const printReport = () => {
    if (!salaries.length) {
      alert("There is no payroll data to print.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=1200,height=900");

    if (!printWindow) {
      alert(
        "Unable to open the print window. Please allow pop-ups for this site."
      );
      return;
    }

    const departmentLabel =
      filters.department === "all"
        ? "All Departments"
        : departments.find(
            (department) => department._id === filters.department
          )?.dep_name || "Selected Department";

    const statusLabel =
      filters.status === "all" ? "All Statuses" : filters.status;

    const payrollRows = salaries
      .map(
        (salary) => `
          <tr>
            <td>${formatEmployeeName(salary.employeeId)}</td>
            <td>${getEmployeeNumber(salary.employeeId)}</td>
            <td>${getDepartmentName(salary.employeeId)}</td>
            <td>${formatPeriod(salary)}</td>
            <td class="number">KSh ${formatMoney(salary.grossSalary)}</td>
            <td class="number">KSh ${formatMoney(salary.deductions)}</td>
            <td class="number">KSh ${formatMoney(salary.netSalary)}</td>
            <td>
              <span class="status status-${String(
                salary.status || ""
              ).toLowerCase()}">
                ${salary.status || "—"}
              </span>
            </td>
          </tr>
        `
      )
      .join("");

    const departmentRows = departmentBreakdown
      .map(
        (department) => `
          <tr>
            <td>${department.departmentName || "Unassigned"}</td>
            <td class="number">${department.employeeCount || 0}</td>
            <td class="number">KSh ${formatMoney(
              department.grossSalary
            )}</td>
            <td class="number">KSh ${formatMoney(
              department.totalDeductions
            )}</td>
            <td class="number">KSh ${formatMoney(
              department.netSalary
            )}</td>
            <td class="number">KSh ${formatMoney(
              department.employerContributions
            )}</td>
            <td class="number">KSh ${formatMoney(
              department.totalPayrollCost
            )}</td>
          </tr>
        `
      )
      .join("");

    const generatedAt = new Date().toLocaleString("en-KE");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SmartJobs Ltd - Payroll Report</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 30px;
              color: #1f2937;
              background: #ffffff;
            }

            .header {
              border-bottom: 2px solid #0f766e;
              padding-bottom: 18px;
              margin-bottom: 24px;
            }

            .company {
              font-size: 25px;
              font-weight: 700;
              color: #0f766e;
              margin-bottom: 5px;
            }

            .title {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 5px;
            }

            .meta {
              color: #6b7280;
              font-size: 12px;
              line-height: 1.7;
            }

            .section {
              margin-top: 28px;
              page-break-inside: avoid;
            }

            .section-title {
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 10px;
              padding-bottom: 7px;
              border-bottom: 1px solid #d1d5db;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
            }

            .summary-card {
              border: 1px solid #d1d5db;
              padding: 12px;
              border-radius: 5px;
            }

            .summary-label {
              font-size: 10px;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 5px;
            }

            .summary-value {
              font-size: 16px;
              font-weight: 700;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }

            th {
              background: #f3f4f6;
              font-weight: 700;
              text-align: left;
            }

            th,
            td {
              border: 1px solid #d1d5db;
              padding: 7px;
            }

            .number {
              text-align: right;
            }

            .status {
              font-weight: 700;
            }

            .status-paid {
              color: #15803d;
            }

            .status-processed {
              color: #1d4ed8;
            }

            .status-pending {
              color: #a16207;
            }

            .footer {
              margin-top: 35px;
              padding-top: 10px;
              border-top: 1px solid #d1d5db;
              color: #6b7280;
              font-size: 10px;
            }

            @media print {
              body {
                padding: 15px;
              }

              .section {
                page-break-inside: avoid;
              }

              table {
                page-break-inside: auto;
              }

              tr {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="company">SmartJobs Ltd</div>
            <div class="title">Payroll Report</div>

            <div class="meta">
              <strong>Payroll Period:</strong> ${reportLabel}<br />
              <strong>Department:</strong> ${departmentLabel}<br />
              <strong>Status:</strong> ${statusLabel}<br />
              <strong>Generated:</strong> ${generatedAt}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payroll Overview</div>

            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-label">Payroll Records</div>
                <div class="summary-value">
                  ${summary.employeeCount}
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Gross Payroll</div>
                <div class="summary-value">
                  KSh ${formatMoney(summary.grossSalary)}
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Total Deductions</div>
                <div class="summary-value">
                  KSh ${formatMoney(summary.totalDeductions)}
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Net Payroll</div>
                <div class="summary-value">
                  KSh ${formatMoney(summary.netSalary)}
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Employer Contributions</div>
                <div class="summary-value">
                  KSh ${formatMoney(
                    summary.totalEmployerContributions
                  )}
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Total Payroll Cost</div>
                <div class="summary-value">
                  KSh ${formatMoney(summary.totalPayrollCost)}
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Statutory Deductions</div>

            <table>
              <thead>
                <tr>
                  <th>NSSF</th>
                  <th>SHIF</th>
                  <th>Housing Levy</th>
                  <th>PAYE</th>
                  <th>Total Deductions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="number">KSh ${formatMoney(
                    summary.nssf
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.shif
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.housingLevy
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.paye
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.totalDeductions
                  )}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Employer Contributions</div>

            <table>
              <thead>
                <tr>
                  <th>Employer NSSF</th>
                  <th>Employer Housing Levy</th>
                  <th>NITA</th>
                  <th>Total Employer Contributions</th>
                  <th>Total Payroll Cost</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="number">KSh ${formatMoney(
                    summary.employerNssf
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.employerHousingLevy
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.nita
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.totalEmployerContributions
                  )}</td>
                  <td class="number">KSh ${formatMoney(
                    summary.totalPayrollCost
                  )}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Payroll Status</div>

            <table>
              <thead>
                <tr>
                  <th>Pending</th>
                  <th>Processed</th>
                  <th>Paid</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="number">${statusSummary.Pending}</td>
                  <td class="number">${statusSummary.Processed}</td>
                  <td class="number">${statusSummary.Paid}</td>
                </tr>
              </tbody>
            </table>
          </div>

          ${
            departmentBreakdown.length
              ? `
                <div class="section">
                  <div class="section-title">Department Breakdown</div>

                  <table>
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Records</th>
                        <th>Gross</th>
                        <th>Deductions</th>
                        <th>Net</th>
                        <th>Employer Contributions</th>
                        <th>Total Payroll Cost</th>
                      </tr>
                    </thead>

                    <tbody>
                      ${departmentRows}
                    </tbody>
                  </table>
                </div>
              `
              : ""
          }

          <div class="section">
            <div class="section-title">Payroll Details</div>

            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Period</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                ${payrollRows}
              </tbody>
            </table>
          </div>

          <div class="footer">
            SmartJobs Ltd Payroll System — Confidential Payroll Report
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Payroll Reports
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Analyse payroll costs, statutory deductions, employee
            payments and departmental payroll performance.
          </p>
        </div>

        <button
          onClick={printReport}
          disabled={!salaries.length || loading}
          className="
            bg-teal-600
            hover:bg-teal-700
            disabled:bg-gray-400
            disabled:cursor-not-allowed
            text-white
            px-5
            py-2.5
            rounded-lg
            text-sm
            font-semibold
            shadow-sm
            transition
          "
        >
          🖨️ Print Report
        </button>
      </div>

      {/* ============================================================
          FILTERS
      ============================================================ */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Report Filters
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Select the payroll period and employee group to analyse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Month */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>

            <select
              value={filters.month}
              onChange={(event) =>
                handleFilterChange("month", event.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500
              "
            >
              <option value="all">All Months</option>

              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>

            <input
              type="number"
              min="2000"
              max="2100"
              value={filters.year}
              onChange={(event) =>
                handleFilterChange("year", event.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500
              "
            />
          </div>

          {/* Status */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payroll Status
            </label>

            <select
              value={filters.status}
              onChange={(event) =>
                handleFilterChange("status", event.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500
              "
            >
              <option value="all">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>

            <select
              value={filters.department}
              onChange={(event) =>
                handleFilterChange("department", event.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500
              "
            >
              <option value="all">All Departments</option>

              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.dep_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 mt-5">
          <button
            onClick={resetFilters}
            className="
              border
              border-gray-300
              hover:bg-gray-50
              text-gray-700
              px-5
              py-2.5
              rounded-lg
              text-sm
              font-semibold
            "
          >
            Reset
          </button>

          <button
            onClick={applyFilters}
            disabled={loading}
            className="
              bg-teal-600
              hover:bg-teal-700
              disabled:bg-gray-400
              text-white
              px-5
              py-2.5
              rounded-lg
              text-sm
              font-semibold
            "
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      </div>

      {/* ============================================================
          ERROR
      ============================================================ */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ============================================================
          LOADING
      ============================================================ */}

      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center mb-6">
          <div className="text-gray-500 text-sm">
            Loading payroll report...
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* ========================================================
              REPORT PERIOD
          ======================================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Payroll Overview
              </h2>

              <p className="text-xs text-gray-500">
                Showing payroll data for {reportLabel}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              {salaries.length} payroll record
              {salaries.length === 1 ? "" : "s"}
            </div>
          </div>

          {/* ========================================================
              SUMMARY CARDS
          ======================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Payroll Records
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                {summary.employeeCount}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Salary records in this report
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Gross Payroll
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                KSh {formatMoney(summary.grossSalary)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Total employee earnings
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Deductions
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                KSh {formatMoney(summary.totalDeductions)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Employee deductions
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Net Payroll
              </p>

              <p className="text-2xl font-bold text-teal-700 mt-2">
                KSh {formatMoney(summary.netSalary)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Total employee take-home pay
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Employer Contributions
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                KSh{" "}
                {formatMoney(summary.totalEmployerContributions)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Employer statutory cost
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Payroll Cost
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                KSh {formatMoney(summary.totalPayrollCost)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Gross payroll + employer costs
              </p>
            </div>
          </div>

          {/* ========================================================
              STATUTORY + EMPLOYER CONTRIBUTIONS
          ======================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Statutory deductions */}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Statutory Deductions
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Employee statutory payroll deductions.
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    NSSF
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh {formatMoney(summary.nssf)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    SHIF
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh {formatMoney(summary.shif)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Housing Levy
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh {formatMoney(summary.housingLevy)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    PAYE
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh {formatMoney(summary.paye)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">
                    Total Deductions
                  </span>

                  <span className="font-bold text-red-600">
                    KSh {formatMoney(summary.totalDeductions)}
                  </span>
                </div>
              </div>
            </div>

            {/* Employer contributions */}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Employer Contributions
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Employer statutory payroll obligations.
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Employer NSSF
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh {formatMoney(summary.employerNssf)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Employer Housing Levy
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh{" "}
                    {formatMoney(summary.employerHousingLevy)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    NITA
                  </span>

                  <span className="font-semibold text-gray-800">
                    KSh {formatMoney(summary.nita)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">
                    Total Employer Contributions
                  </span>

                  <span className="font-bold text-teal-700">
                    KSh{" "}
                    {formatMoney(
                      summary.totalEmployerContributions
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              PAYROLL STATUS
          ======================================================== */}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Payroll Status
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Distribution of payroll records by processing status.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Pending
                </p>

                <p className="text-2xl font-bold text-yellow-600 mt-2">
                  {statusSummary.Pending}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Awaiting processing or payment
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Processed
                </p>

                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {statusSummary.Processed}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Payroll processed
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Paid
                </p>

                <p className="text-2xl font-bold text-green-600 mt-2">
                  {statusSummary.Paid}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Payroll completed and paid
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================
              DEPARTMENT BREAKDOWN
          ======================================================== */}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Department Breakdown
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Payroll performance and cost by department.
              </p>
            </div>

            {departmentBreakdown.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">
                        Department
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Records
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Gross
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Deductions
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Net
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Employer Contributions
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Total Payroll Cost
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {departmentBreakdown.map((department) => (
                      <tr
                        key={
                          department.departmentId ||
                          department.departmentName
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {department.departmentName ||
                            "Unassigned"}
                        </td>

                        <td className="px-5 py-4 text-right text-gray-600">
                          {department.employeeCount || 0}
                        </td>

                        <td className="px-5 py-4 text-right text-gray-800">
                          KSh{" "}
                          {formatMoney(
                            department.grossSalary
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-red-600">
                          KSh{" "}
                          {formatMoney(
                            department.totalDeductions
                          )}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-teal-700">
                          KSh{" "}
                          {formatMoney(
                            department.netSalary
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-gray-800">
                          KSh{" "}
                          {formatMoney(
                            department.employerContributions
                          )}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-gray-800">
                          KSh{" "}
                          {formatMoney(
                            department.totalPayrollCost
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500 text-sm">
                No department payroll data found for the selected
                filters.
              </div>
            )}
          </div>

          {/* ========================================================
              PAYROLL DETAILS
          ======================================================== */}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Payroll Details
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Individual payroll records included in this report.
                </p>
              </div>

              <button
                onClick={printReport}
                disabled={!salaries.length}
                className="
                  bg-gray-800
                  hover:bg-gray-900
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  text-xs
                  font-semibold
                "
              >
                🖨️ Print
              </button>
            </div>

            {salaries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">
                        Employee
                      </th>

                      <th className="text-left px-5 py-3 font-semibold text-gray-600">
                        Employee ID
                      </th>

                      <th className="text-left px-5 py-3 font-semibold text-gray-600">
                        Department
                      </th>

                      <th className="text-left px-5 py-3 font-semibold text-gray-600">
                        Period
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Gross
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Deductions
                      </th>

                      <th className="text-right px-5 py-3 font-semibold text-gray-600">
                        Net
                      </th>

                      <th className="text-center px-5 py-3 font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {salaries.map((salary) => (
                      <tr
                        key={salary._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-800">
                            {formatEmployeeName(
                              salary.employeeId
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {getEmployeeNumber(
                            salary.employeeId
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {getDepartmentName(
                            salary.employeeId
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatPeriod(salary)}
                        </td>

                        <td className="px-5 py-4 text-right text-gray-800">
                          KSh{" "}
                          {formatMoney(
                            salary.grossSalary
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-red-600">
                          KSh{" "}
                          {formatMoney(
                            salary.deductions
                          )}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-teal-700">
                          KSh{" "}
                          {formatMoney(
                            salary.netSalary
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                              salary.status
                            )}`}
                          >
                            {salary.status || "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">📊</div>

                <h3 className="font-semibold text-gray-700">
                  No payroll records found
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try changing the report filters or create payroll
                  records first.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PayrollReports;