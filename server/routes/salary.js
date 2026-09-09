import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addSalary,
  getSalary,
  getPayslip,
  getPayrollReports,
} from "../controllers/salaryController.js";

const router = express.Router();

// ============================================================
// CREATE PAYROLL
// ADMIN ONLY
// ============================================================

router.post(
  "/",
  authMiddleware,
  addSalary
);
// ============================================================
// INDIVIDUAL PAYSLIP
// ADMIN → any paid payslip
// EMPLOYEE → own paid payslip
// ============================================================
router.get(
  "/payslip/:salaryId",
  authMiddleware,
  getPayslip
);
// ============================================================
// PAYROLL REPORTS
// ADMIN ONLY
// IMPORTANT: Must come before /:id
// ============================================================
router.get(
  "/reports",
  authMiddleware,
  getPayrollReports
);
// ============================================================
// EMPLOYEE SALARY HISTORY
// ADMIN → selected employee
// EMPLOYEE → own salary
// ============================================================
router.get(
  "/:id",
  authMiddleware,
  getSalary
);

export default router;