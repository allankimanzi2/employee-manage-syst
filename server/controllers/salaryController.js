import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

// Add a new salary
const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

    // Validate required fields
    if (!employeeId || basicSalary == null || allowances == null || deductions == null || !payDate) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Calculate net salary
    const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    });

    await newSalary.save();

    return res.status(201).json({ success: true, salary: newSalary });
  } catch (error) {
    console.error("Add salary error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while adding salary" });
  }
};

// Get salaries
const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, error: "ID is required" });
    }

    let salaries = [];

    if (role === "admin") {
      salaries = await Salary.find({ employeeId: id }).populate("employeeId", "employeeId name");
    } else {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      salaries = await Salary.find({ employeeId: employee._id }).populate("employeeId", "employeeId name");
    }

    return res.status(200).json({ success: true, salary: salaries });
  } catch (error) {
    console.error("Get salary error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while fetching salaries" });
  }
};

export { addSalary, getSalary };
