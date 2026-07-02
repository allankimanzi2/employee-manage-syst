import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/authContext";

const View = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const { user } = useAuth();

  const fetchSalaries = async () => {
    try {
      const response = await API.get(`/salary/${id}/${user.role}`);

      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      } else {
        setError("Failed to load salary data.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Network error. Please try again."
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchSalaries();
    }
  }, [user]);

  const filterSalaries = (e) => {
    const q = e.target.value.toLowerCase();

    const filtered = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(q)
    );

    setFilteredSalaries(filtered);
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto p-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Salary History</h2>
      </div>

      {error && (
        <p className="text-red-600 text-center my-3 font-semibold">
          {error}
        </p>
      )}

      <div className="flex justify-end my-3">
        <input
          type="text"
          placeholder="Search By Emp ID"
          className="border px-2 rounded-md py-1 border-gray-300"
          onChange={filterSalaries}
        />
      </div>

      {filteredSalaries.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
            <tr>
              <th className="px-6 py-3">SNO</th>
              <th className="px-6 py-3">Emp ID</th>
              <th className="px-6 py-3">Basic Salary</th>
              <th className="px-6 py-3">Allowance</th>
              <th className="px-6 py-3">Deduction</th>
              <th className="px-6 py-3">Net Salary</th>
              <th className="px-6 py-3">Pay Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredSalaries.map((salary, index) => (
              <tr
                key={salary._id}
                className="bg-white border-b"
              >
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">
                  {salary.employeeId.employeeId}
                </td>
                <td className="px-6 py-3">
                  {salary.basicSalary}
                </td>
                <td className="px-6 py-3">
                  {salary.allowances}
                </td>
                <td className="px-6 py-3">
                  {salary.deductions}
                </td>
                <td className="px-6 py-3">
                  {salary.netSalary}
                </td>
                <td className="px-6 py-3">
                  {new Date(salary.payDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center mt-5">No Records Found</div>
      )}
    </div>
  );
};

export default View;