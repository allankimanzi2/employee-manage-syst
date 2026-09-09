import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

// ============================================================
// HELPER
// ============================================================

const getLoggedInEmployee = async (userId) => {
  return await Employee.findOne({ userId });
};

// ============================================================
// EMPLOYEE SELF-SERVICE
// ============================================================

// Employee submits their own leave request
export const addMyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const employee = await getLoggedInEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid leave dates",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        error: "End date cannot be before start date",
      });
    }

    // Prevent overlapping pending/approved leave
    const overlappingLeave = await Leave.findOne({
      employeeId: employee._id,
      status: {
        $in: ["Pending", "Approved"],
      },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (overlappingLeave) {
      return res.status(400).json({
        success: false,
        error:
          "You already have a pending or approved leave covering these dates.",
      });
    }

    const leave = await Leave.create({
      employeeId: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave,
    });
  } catch (error) {
    console.error("Add My Leave Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Employee gets their own leave requests
export const getMyLeaves = async (req, res) => {
  try {
    const employee = await getLoggedInEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found",
      });
    }

    const leaves = await Leave.find({
      employeeId: employee._id,
    }).sort({
      appliedAt: -1,
    });

    return res.json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("Get My Leaves Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Employee gets pending leave count
export const getMyPendingLeaveCount = async (req, res) => {
  try {
    const employee = await getLoggedInEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found",
      });
    }

    const count = await Leave.countDocuments({
      employeeId: employee._id,
      status: "Pending",
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get pending leave count error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ============================================================
// ADMIN / MANAGEMENT
// ============================================================

// Existing admin-style add leave
// Add a new leave request
export const addLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    // Validate request
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid leave dates",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        error: "End date cannot be before start date",
      });
    }

    // Find employee belonging to logged-in user
    const employee = await Employee.findOne({
      userId: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found",
      });
    }

    // Create leave request
    const newLeave = await Leave.create({
      employeeId: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave: newLeave,
    });

  } catch (error) {
    console.error("Add leave error:", error);

    return res.status(500).json({
      success: false,
      error: "Server error while submitting leave request",
    });
  }
};


// Get leaves by user or admin
export const getLeave = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID is required",
      });
    }

    let leaves = [];

    if (role === "admin") {
      leaves = await Leave.find();
    } else {
      const employee = await Employee.findOne({
        userId: id,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      leaves = await Leave.find({
        employeeId: employee._id,
      });
    }

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("Get leave error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Server error while fetching leave",
    });
  }
};


// Get all leaves with employee information
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "department",
            select: "dep_name",
          },
          {
            path: "userId",
            select: "name email",
          },
        ],
      })
      .sort({
        appliedAt: -1,
      });

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("Get leaves error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Server error while fetching leaves",
    });
  }
};


// Get leave detail
export const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid leave ID",
      });
    }

    const leave = await Leave.findById(id).populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name profileImage",
        },
      ],
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found",
      });
    }

    return res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    console.error("Get leave detail error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Server error while fetching leave detail",
    });
  }
};


// Update leave status
export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid leave status",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found",
      });
    }

    return res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    console.error("Update leave error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
