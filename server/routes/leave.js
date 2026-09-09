import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addLeave,
  addMyLeave,
  getMyLeaves,
  getMyPendingLeaveCount,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

// ============================================================
// EMPLOYEE SELF-SERVICE
// ============================================================

// Submit own leave request
router.post(
  "/my",
  authMiddleware,
  addMyLeave
);

// Get own leave requests
router.get(
  "/my",
  authMiddleware,
  getMyLeaves
);

// Get own pending leave count
router.get(
  "/my/pending-count",
  authMiddleware,
  getMyPendingLeaveCount
);


// ============================================================
// ADMIN / MANAGEMENT
// ============================================================

// Add leave for employee
router.post(
  "/add",
  authMiddleware,
  addLeave
);

// Get leave detail
router.get(
  "/detail/:id",
  authMiddleware,
  getLeaveDetail
);

// Get leave for employee/admin
router.get(
  "/:id/:role",
  authMiddleware,
  getLeave
);

// Get all leaves
router.get(
  "/",
  authMiddleware,
  getLeaves
);

// Approve / reject leave
router.put(
  "/:id",
  authMiddleware,
  updateLeave
);

export default router;