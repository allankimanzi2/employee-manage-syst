import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  addLeave, 
  getLeave, 
  getLeaves, 
  getLeaveDetail, 
  updateLeave 
} from '../controllers/leaveController.js';

const router = express.Router();

// Add Leave
router.post('/add', authMiddleware, addLeave);

// Get leave detail by ID
router.get('/detail/:id', authMiddleware, getLeaveDetail);

// Get leave for one employee based on ID and role
router.get('/:id/:role', authMiddleware, getLeave);

// Get all leaves
router.get('/', authMiddleware, getLeaves);

// Update leave
router.put('/:id', authMiddleware, updateLeave);

export default router;
