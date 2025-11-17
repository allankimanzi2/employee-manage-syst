import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

// Add a new leave
const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(201).json({ success: true, leave: newLeave });
  } catch (error) {
    console.error("Add leave error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while adding leave" });
  }
};

// Get leaves by user or admin
const getLeave = async (req, res) => {
  try {
    const { id, role } = req.params;
    let leaves = [];

    if (!id) {
      return res.status(400).json({ success: false, error: "ID is required" });
    }

    if (role === "admin") {
      leaves = await Leave.find();
    } else {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Get leave error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while fetching leave" });
  }
};

// Get all leaves with populated employee info
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name" },
      ],
    });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Get leaves error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while fetching leaves" });
  }
};

// Get leave detail by ID
const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid leave ID" });
    }

    const leave = await Leave.findById(id).populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name profileImage" },
      ],
    });

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Get leave detail error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while fetching leave detail" });
  }
};

// Update leave status
const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required" });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Update leave error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while updating leave" });
  }
};

export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };
