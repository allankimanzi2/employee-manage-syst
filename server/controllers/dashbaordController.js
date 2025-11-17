import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

// ✅ Get dashboard summary
const getSummary = async (req, res) => {
  try {
    // Total employees
    const totalEmployees = await Employee.countDocuments();

    // Total departments
    const totalDepartments = await Department.countDocuments();

    // Total salaries
    const totalSalariesResult = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    ]);

    const totalSalary = totalSalariesResult[0]?.totalSalary || 0;

    // Employees who applied for leave
    const employeeAppliedForLeave = await Leave.distinct("employeeId");

    // Leave counts by status
    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find((item) => item._id === "Approved")?.count || 0,
      rejected: leaveStatus.find((item) => item._id === "Rejected")?.count || 0,
      pending: leaveStatus.find((item) => item._id === "Pending")?.count || 0,
    };

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary,
      leaveSummary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch dashboard summary" });
  }
};

export { getSummary };
