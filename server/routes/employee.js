import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeeByDepId,
} from "../controllers/employeeController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Employee Routes
|--------------------------------------------------------------------------
*/

// Get all employees
router.get("/", authMiddleware, getEmployees);

// Get employees by department
router.get("/department/:id", authMiddleware, fetchEmployeeByDepId);

// Get one employee
router.get("/:id", authMiddleware, getEmployee);

// Add employee
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  addEmployee
);

// Update employee
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateEmployee
);

export default router;