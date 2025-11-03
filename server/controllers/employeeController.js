import multer from "multer";
import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Department from "../models/Department.js";

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add Employee
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

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already registered." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create new User
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // Create new Employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();

    return res
      .status(200)
      .json({ success: true, message: "Employee created successfully." });
  } catch (error) {
    console.error("Add Employee Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error while adding employee." });
  }
};

// Get all Employees
const getEmployees = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    employee = await Employee.findById({_id: id})
      .populate("userId", { password: 0})
      .populate("department");
      if(!employee) {
        employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
      }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Get Employees Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error while fetching employees." });
  }
};

// Get a single Employee
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id)
      .populate("userId", "-password")
      .populate("department");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found." });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Get Employee Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error while fetching employee." });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found." });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found." });
    }

    // Update User
    await User.findByIdAndUpdate(user._id, { name });

    // Update Employee
    await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      department,
      salary,
    });

    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully." });
  } catch (error) {
    console.error("Update Employee Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error while updating employee." });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.find({department: id})
    return res.status(200).json({ success: true, employees});
  } catch (error) {
      return res
        .status(404)
        .json({ success: false, error: "get employeesByDepId server error" });
    }

}

// Export all controller functions
export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId
};
