import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Must be at the top

import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';
import dashboardRouter from './routes/dashboard.js';
import testRouter from './routes/test.js';

import connectToDatabase from './db/db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'));

// Test route first
app.use('/api/test', testRouter);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/dashboard', dashboardRouter);

// Start server
const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
  });

