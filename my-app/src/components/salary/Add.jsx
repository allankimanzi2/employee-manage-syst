import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../utils/api";
import {
  fetchDepartments,
  getEmployees,
} from "../../utils/EmployeeHelper";

const Add = () => {
  const navigate = useNavigate();

  // ============================================================
  // FORM STATE
  // ============================================================

  const [salary, setSalary] = useState({
    employeeId: "",
    payrollMonth: "",
    payrollYear: new Date().getFullYear(),
    basicSalary: "",
    allowances: 0,
    otherDeductions: 0,
    payDate: "",
    status: "Pending",
  });

  // ============================================================
  // DATA STATE
  // ============================================================

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ============================================================
  // UI STATE
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // MONTHS
  // ============================================================

  const months = [
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

  // ============================================================
  // LOAD DEPARTMENTS
  // ============================================================

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        setError("");

        const deps = await fetchDepartments();

        setDepartments(deps);
      } catch (err) {
        console.error("Department loading error:", err);

        setError("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  // ============================================================
  // DEPARTMENT CHANGE
  // ============================================================

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;

    setSalary((prev) => ({
      ...prev,
      employeeId: "",
    }));

    setEmployees([]);

    if (!departmentId) {
      return;
    }

    try {
      setEmployeesLoading(true);
      setError("");

      const emps = await getEmployees(departmentId);

      setEmployees(emps);
    } catch (err) {
      console.error("Employee loading error:", err);

      setError("Failed to load employees.");
    } finally {
      setEmployeesLoading(false);
    }
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSalary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ----------------------------------------------------------
    // Basic frontend validation
    // ----------------------------------------------------------

    if (!salary.employeeId) {
      setError("Please select an employee.");
      return;
    }

    if (!salary.payrollMonth) {
      setError("Please select a payroll month.");
      return;
    }

    if (!salary.payrollYear) {
      setError("Please enter the payroll year.");
      return;
    }

    if (!salary.basicSalary || Number(salary.basicSalary) <= 0) {
      setError("Basic salary must be greater than zero.");
      return;
    }

    if (Number(salary.allowances) < 0) {
      setError("Allowances cannot be negative.");
      return;
    }

    if (Number(salary.otherDeductions) < 0) {
      setError("Other deductions cannot be negative.");
      return;
    }

    if (!salary.payDate) {
      setError("Please select the payment date.");
      return;
    }

    // ----------------------------------------------------------
    // Submit
    // ----------------------------------------------------------

    try {
      setSubmitting(true);

      const response = await API.post("/salary", {
        employeeId: salary.employeeId,
        payrollMonth: salary.payrollMonth,
        payrollYear: Number(salary.payrollYear),

        basicSalary: Number(salary.basicSalary),
        allowances: Number(salary.allowances) || 0,
        otherDeductions: Number(salary.otherDeductions) || 0,

        payDate: salary.payDate,
        status: salary.status,
      });

      if (response.data.success) {
        setSuccess("Payroll created successfully.");

        // Small delay so admin sees success message
        setTimeout(() => {
          navigate(
            `/admin-dashboard/employees/salary/${salary.employeeId}`
          );
        }, 800);
      } else {
        setError(
          response.data.error ||
            "Failed to create payroll."
        );
      }
    } catch (err) {
      console.error("Payroll submission error:", err);

      setError(
        err.response?.data?.error ||
          "Server error while creating payroll."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-600">
          Loading departments...
        </p>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-10 bg-white p-8 rounded-lg shadow-md">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Create Payroll
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Create a monthly payroll record for an employee.
        </p>
      </div>

      {/* ====================================================== */}
      {/* ERROR */}
      {/* ====================================================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* ====================================================== */}
      {/* SUCCESS */}
      {/* ====================================================== */}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* ====================================================== */}
      {/* FORM */}
      {/* ====================================================== */}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ================================================== */}
          {/* DEPARTMENT */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>

            <select
              name="department"
              onChange={handleDepartmentChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">
                Select Department
              </option>

              {departments.map((department) => (
                <option
                  key={department._id}
                  value={department._id}
                >
                  {department.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* ================================================== */}
          {/* EMPLOYEE */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>

            <select
              name="employeeId"
              value={salary.employeeId}
              onChange={handleChange}
              disabled={
                employeesLoading ||
                employees.length === 0
              }
              className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">
                {employeesLoading
                  ? "Loading employees..."
                  : employees.length === 0
                  ? "Select department first"
                  : "Select Employee"}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee._id}
                  value={employee._id}
                >
                  {employee.employeeId} —{" "}
                  {employee.userId?.name || "Unnamed Employee"}
                </option>
              ))}
            </select>
          </div>

          {/* ================================================== */}
          {/* PAYROLL MONTH */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payroll Month
            </label>

            <select
              name="payrollMonth"
              value={salary.payrollMonth}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">
                Select Month
              </option>

              {months.map((month) => (
                <option
                  key={month}
                  value={month}
                >
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* ================================================== */}
          {/* PAYROLL YEAR */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payroll Year
            </label>

            <input
              type="number"
              name="payrollYear"
              value={salary.payrollYear}
              onChange={handleChange}
              min="2000"
              max="2100"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* ================================================== */}
          {/* BASIC SALARY */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Salary (KSh)
            </label>

            <input
              type="number"
              name="basicSalary"
              value={salary.basicSalary}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 50000"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* ================================================== */}
          {/* ALLOWANCES */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowances (KSh)
            </label>

            <input
              type="number"
              name="allowances"
              value={salary.allowances}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 5000"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <p className="text-xs text-gray-500 mt-1">
              Housing, transport, airtime, etc.
            </p>
          </div>

          {/* ================================================== */}
          {/* OTHER DEDUCTIONS */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Deductions (KSh)
            </label>

            <input
              type="number"
              name="otherDeductions"
              value={salary.otherDeductions}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 1000"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <p className="text-xs text-gray-500 mt-1">
              Loans, approved recoveries, etc.
            </p>
          </div>

          {/* ================================================== */}
          {/* PAY DATE */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Date
            </label>

            <input
              type="date"
              name="payDate"
              value={salary.payDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* ================================================== */}
          {/* STATUS */}
          {/* ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payroll Status
            </label>

            <select
              name="status"
              value={salary.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Processed">
                Processed
              </option>

              <option value="Paid">
                Paid
              </option>
            </select>
          </div>

        </div>

        {/* ==================================================== */}
        {/* INFORMATION BOX */}
        {/* ==================================================== */}

        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-md p-5">

          <h3 className="font-semibold text-gray-800 mb-2">
            Automatic Payroll Calculations
          </h3>

          <p className="text-sm text-gray-600">
            Once submitted, the system will automatically calculate:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">

            <div className="bg-white p-3 rounded border">
              NSSF
            </div>

            <div className="bg-white p-3 rounded border">
              SHIF
            </div>

            <div className="bg-white p-3 rounded border">
              Housing Levy
            </div>

            <div className="bg-white p-3 rounded border">
              PAYE
            </div>

            <div className="bg-white p-3 rounded border">
              Total Deductions
            </div>

            <div className="bg-white p-3 rounded border">
              Net Salary
            </div>

            <div className="bg-white p-3 rounded border">
              Employer NSSF
            </div>

            <div className="bg-white p-3 rounded border">
              NITA
            </div>

          </div>
        </div>

        {/* ==================================================== */}
        {/* BUTTONS */}
        {/* ==================================================== */}

        <div className="flex gap-4 mt-8">

          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/employees")
            }
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-3 px-4 rounded-md"
          >
            {submitting
              ? "Creating Payroll..."
              : "Create Payroll"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default Add;