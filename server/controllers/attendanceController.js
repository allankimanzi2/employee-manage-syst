import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// Check in an employee
export const checkIn = async (req, res) => {
  try {
    const { employeeId, workMode = "On-site" } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID is required",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const { start, end } = getTodayRange();

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: "Employee has already checked in today",
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      employeeId,
      date: new Date(),
      status: "Present",
      workMode,
      checkIn: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Employee checked in successfully",
      attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Check out an employee
export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID is required",
      });
    }

    const { start, end } = getTodayRange();

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: "Employee has not checked in today",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        error: "Employee has already checked out today",
      });
    }

    attendance.checkOut = new Date();

    await attendance.save();

    return res.json({
      success: true,
      message: "Employee checked out successfully",
      attendance,
    });
  } catch (error) {
    console.error("Check-out error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get today's attendance
export const getTodayAttendance = async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    const attendance = await Attendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate({
        path: "employeeId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ checkIn: 1 });

    return res.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ============================================================
// EMPLOYEE SELF-SERVICE ATTENDANCE
// ============================================================

// Find the Employee record belonging to the logged-in User
const getLoggedInEmployee = async (userId) => {
  const employee = await Employee.findOne({
    userId: userId,
  });

  return employee;
};


// Get logged-in employee's attendance for today
export const getMyTodayAttendance = async (req, res) => {
  try {
    const employee = await getLoggedInEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found.",
      });
    }

    const { start, end } = getTodayRange();

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    return res.json({
      success: true,
      attendance: attendance || null,
    });

  } catch (error) {
    console.error("Get My Attendance Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Logged-in employee checks themselves in
export const checkInMyself = async (req, res) => {
  try {
    const { workMode = "On-site" } = req.body;

    const employee = await getLoggedInEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found.",
      });
    }

    const { start, end } = getTodayRange();

    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: "You have already checked in today.",
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      employeeId: employee._id,
      date: new Date(),
      status: "Present",
      workMode,
      checkIn: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "You have been checked in successfully.",
      attendance,
    });

  } catch (error) {
    console.error("My Check-in Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Logged-in employee checks themselves out
export const checkOutMyself = async (req, res) => {
  try {
    const employee = await getLoggedInEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found.",
      });
    }

    const { start, end } = getTodayRange();

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: "You have not checked in today.",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        error: "You have already checked out today.",
      });
    }

    attendance.checkOut = new Date();

    await attendance.save();

    return res.json({
      success: true,
      message: "You have been checked out successfully.",
      attendance,
    });

  } catch (error) {
    console.error("My Check-out Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Get logged-in employee's attendance for today
export const getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee profile not found",
      });
    }

    const { start, end } = getTodayRange();

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    return res.json({
      success: true,
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        designation: employee.designation,
        department: employee.department,
        salary: employee.salary,
      },
      attendance: attendance || null,
    });
  } catch (error) {
    console.error("Get my attendance error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};