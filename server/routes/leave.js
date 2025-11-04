import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave } from '../controllers/leaveController.js'


const router = express.Router()

router.post('/add', authMiddleware, addLeave)
router.get('/:id', authMiddleware, getLeave)
router.get('/:id', authMiddleware, getLeave)
router.get('detail/:id', authMiddleware, getLeaveDetail)
router.put('/', authMiddleware, updateLeave)

export default router