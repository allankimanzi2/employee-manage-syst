import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";

import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

// ============================
// Multer Configuration
// ============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ============================
// Add Employee
// ============================

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists.",
      });
    }

    // Check department exists
    const dep = await Department.findById(department);

    if (!dep) {
      return res.status(404).json({
        success: false,
        error: "Department not found.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    // Create Employee
    await Employee.create({
      userId: user._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    return res.status(201).json({
      success: true,
      message: "Employee added successfully.",
    });
  } catch (error) {
    console.error("Add Employee Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============================
// Get All Employees
// ============================

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "-password")
      .populate("department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============================
// Get Single Employee
// ============================

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate("userId", "-password")
      .populate("department");

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get Employee Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============================
// Update Employee
// ============================

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      maritalStatus,
      designation,
      department,
      salary,
    } = req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found.",
      });
    }

    // Update user
    await User.findByIdAndUpdate(employee.userId, {
      name,
    });

    // Update employee
    await Employee.findByIdAndUpdate(
      id,
      {
        maritalStatus,
        designation,
        department,
        salary,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
    });
  } catch (error) {
    console.error("Update Employee Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============================
// Get Employees By Department
// ============================

const fetchEmployeeByDepId = async (req, res) => {
  try {
    const { id } = req.params;

    const employees = await Employee.find({ department: id })
      .populate("userId", "-password")
      .populate("department");

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// ============================
// Exports
// ============================

export {
  upload,
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeeByDepId,
};