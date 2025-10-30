import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    dpayDate: null,
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    const getDepartments = async () => {
        const departmentsData = await fetchDepartments();
        setDepartments(departments);
      };
      getDepartments();
        
      }, []);

      const handleDepartment = async () => {
        const emps = await getEmployees(e.target.value)
        setEmployees(emps)
      }

      const handleChange =(e) => {
        const { name, value } = e.target;
        setSalary((prevData)) = ({...prevData, {name}: value})
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          const emp = response.data.employee;
          setEmployee({
            name: emp.userId.name,
            maritalStatus: emp.maritalStatus,
            designation: emp.designation,
            salary: emp.salary,
            department: emp.department,
          });
        } else {
          setError('Failed to fetch employee data.');
        }
      } catch (err) {
        console.error('Failed to fetch employee:', err);
        setError('Could not load employee details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/salary/add`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        navigate('/admin-dashboard/employees');
      } else {
        setError(response.data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      if (err.response && err.response.data && !err.response.data.success) {
        setError(err.response.data.error || 'Server responded with an error.');
      } else {
        setError('Network or server error. Please try again.');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    {departments  ?()
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Add Salary</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              onChange={handleDepartment}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* employee */}
          <div className></div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              name="employeeId"
              onChange={handleDepartment}
              value={employee.department}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId}
                </option>
              ))}
            </select>
          </div>

         

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
            <input
              type="number"
              name="basicSalary"
              onChange={handleChange}
              placeholder="basic Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Allownaces</label>
            <input
              type="number"
              name="allowances"
              onChange={handleChange}
              placeholder="allowances"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deductions</label>
            <input
              type="number"
              name="deductions"
              onChange={handleChange}
              placeholder="deductions"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay Date</label>
            <input
              type="number"
              name="payDate"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Add Salary
            </button>
          </div>
      </form>
    </div>
  ); (
    <div>Loading...</div>
  )
};

export default Add;