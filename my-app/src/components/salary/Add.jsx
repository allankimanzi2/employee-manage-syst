import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch Departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deps = await fetchDepartments();
        setDepartments(deps);
      } catch (err) {
        console.error(err);
        setError("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  // Fetch Employees
  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;

    try {
      const emps = await getEmployees(departmentId);
      setEmployees(emps);

      setSalary((prev) => ({
        ...prev,
        employeeId: "",
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSalary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Salary
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await API.post("/salary/add", salary);

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          "Network/server error. Please try again."
      );
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Salary</h2>

      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Department */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>

            <select
              name="department"
              onChange={handleDepartmentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>

              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>

            <select
              name="employeeId"
              value={salary.employeeId}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId} — {emp.userId.name}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Basic Salary
            </label>

            <input
              type="number"
              name="basicSalary"
              value={salary.basicSalary}
              onChange={handleChange}
              placeholder="Basic Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Allowances */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allowances
            </label>

            <input
              type="number"
              name="allowances"
              value={salary.allowances}
              onChange={handleChange}
              placeholder="Allowances"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Deductions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deductions
            </label>

            <input
              type="number"
              name="deductions"
              value={salary.deductions}
              onChange={handleChange}
              placeholder="Deductions"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Pay Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Date
            </label>

            <input
              type="date"
              name="payDate"
              value={salary.payDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit */}
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Add Salary
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Add;