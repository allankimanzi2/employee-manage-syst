import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import API from "../../utils/api";

const Add = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    password: "",
    role: "employee",
    image: null,
  });

  useEffect(() => {
    const loadDepartments = async () => {
      const deps = await fetchDepartments();
      setDepartments(deps);
      console.log("Departments:", deps);
    };

    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      console.log("Submitting employee...");

      const response = await API.post("/employee", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);

      if (response.data.success) {
        alert("Employee Added Successfully");
        navigate("/admin-dashboard/employees");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      {error && (
        <p className="text-red-600 font-semibold mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="border p-2 w-full rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="border p-2 w-full rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              className="border p-2 w-full rounded"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="border p-2 w-full rounded"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              className="border p-2 w-full rounded"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Marital Status</label>
            <select
              name="maritalStatus"
              className="border p-2 w-full rounded"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>

          <div>
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              className="border p-2 w-full rounded"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Department</label>
            <select
              name="department"
              className="border p-2 w-full rounded"
              value={formData.department}
              onChange={handleChange}
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

          <div>
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              className="border p-2 w-full rounded"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="border p-2 w-full rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Role</label>
            <select
              name="role"
              className="border p-2 w-full rounded"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              className="border p-2 w-full rounded"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-3 rounded hover:bg-teal-700"
            >
              Add Employee
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Add;