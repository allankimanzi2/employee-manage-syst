import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
  try {
    // ==========================
    // Summary Cards
    // ==========================

    const totalEmployees = await Employee.countDocuments();

    const totalDepartments = await Department.countDocuments();

    const salaryResult = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);

    const monthlyPayroll = salaryResult[0]?.totalSalary || 0;

    // ==========================
    // Leave Summary
    // ==========================

    const employeesApplied = await Leave.distinct("employeeId");

    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const leaveSummary = {
      applied: employeesApplied.length,
      approved:
        leaveStatus.find((l) => l._id === "Approved")?.count || 0,
      pending:
        leaveStatus.find((l) => l._id === "Pending")?.count || 0,
      rejected:
        leaveStatus.find((l) => l._id === "Rejected")?.count || 0,
    };

    // ==========================
    // Recent Employees
    // ==========================

    const recentEmployees = await Employee.find()
      .populate("userId", "name email")
      .populate("department", "dep_name")
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================
    // Recent Leave Requests
    // ==========================

    const recentLeaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ appliedAt: -1 })
      .limit(5);

    // ==========================
    // Department Distribution
    // ==========================

    const departmentDistribution = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          employees: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $project: {
          department: "$department.dep_name",
          employees: 1,
        },
      },
    ]);

    // ==========================
    // Employee Growth (Last 6 Months)
    // ==========================

    const employeeGrowth = await Employee.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          employees: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    // ==========================
    // Response
    // ==========================

    return res.status(200).json({
      success: true,

      summary: {
        totalEmployees,
        totalDepartments,
        monthlyPayroll,
      },

      leaveSummary,

      recentEmployees,

      recentLeaves,

      departmentDistribution,

      employeeGrowth,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getSummary };