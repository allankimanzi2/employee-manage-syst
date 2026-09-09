import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyTodayAttendance,
  checkInMyself,
  checkOutMyself,
  getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// ============================================================
// ADMIN / MANAGEMENT ATTENDANCE
// ============================================================

router.post("/check-in", authMiddleware, checkIn);

router.post("/check-out", authMiddleware, checkOut);

router.get("/today", authMiddleware, getTodayAttendance);

router.get("/my", authMiddleware, getMyAttendance);


// ============================================================
// EMPLOYEE SELF-SERVICE ATTENDANCE
// ============================================================

router.get(
  "/my/today",
  authMiddleware,
  getMyTodayAttendance
);

router.post(
  "/my/check-in",
  authMiddleware,
  checkInMyself
);

router.post(
  "/my/check-out",
  authMiddleware,
  checkOutMyself
);

export default router;