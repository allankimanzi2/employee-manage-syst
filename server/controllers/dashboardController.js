import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";

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
    // Today's Workforce Overview
    // ==========================

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const todayMonth = now.getMonth() + 1;
    const todayDay = now.getDate();

    const onLeaveToday = await Leave.distinct("employeeId", {
      status: "Approved",
      startDate: { $lte: endOfToday },
      endDate: { $gte: startOfToday },
    });

    const birthdaysToday = await Employee.countDocuments({
      dob: { $exists: true, $ne: null },
      $expr: {
        $and: [
          { $eq: [{ $month: "$dob" }, todayMonth] },
          { $eq: [{ $dayOfMonth: "$dob" }, todayDay] },
        ],
      },
    });

    const workAnniversariesToday = await Employee.countDocuments({
      createdAt: { $lt: startOfToday },
      $expr: {
        $and: [
          { $eq: [{ $month: "$createdAt" }, todayMonth] },
          { $eq: [{ $dayOfMonth: "$createdAt" }, todayDay] },
        ],
      },
    });

    // ==========================
// Today's Attendance
// ==========================

const todayAttendance = await Attendance.find({
  date: {
    $gte: startOfToday,
    $lte: endOfToday,
  },
});

const presentToday = todayAttendance.filter(
  (record) =>
    record.status === "Present" &&
    record.workMode === "On-site"
).length;

const remoteToday = todayAttendance.filter(
  (record) =>
    record.status === "Present" &&
    record.workMode === "Remote"
).length;

const attendanceOnLeave = todayAttendance.filter(
  (record) => record.status === "On Leave"
).length;

// Employees with an approved leave record are already
// accounted for by onLeaveToday.
const totalOnLeave = Math.max(
  onLeaveToday.length,
  attendanceOnLeave
);

// An employee is considered absent if they:
// - are not on approved leave
// - do not have a Present/Remote attendance record
const employeesAccountedFor =
  presentToday +
  remoteToday +
  totalOnLeave;

const absentToday = Math.max(
  totalEmployees - employeesAccountedFor,
  0
);

const workforceOverview = {
  present: presentToday,
  remote: remoteToday,
  onLeave: totalOnLeave,
  absent: absentToday,
  birthdays: birthdaysToday,
  anniversaries: workAnniversariesToday,
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

    const employeeGrowthRaw = await Employee.aggregate([
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
    ]);
    
    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    
    const employeeGrowth = employeeGrowthRaw
      .slice(-6)
      .map((item) => ({
        month: months[item._id.month],
        employees: item.employees,
      }));

    // ==========================
    // Response
    // ==========================

    return res.json({
      success: true,
  
      totalEmployees,
      totalDepartments,
      totalSalary: monthlyPayroll,
  
      leaveSummary,
      
      workforceOverview,
  
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
