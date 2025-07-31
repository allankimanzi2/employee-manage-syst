import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config() // ✅ MUST be at the top, before any env vars are used

import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import connectToDatabase from './db/db.js'
import testRouter from './routes/test.js';


const app = express()

// Middleware
app.use('/api/test', testRouter);
app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)

const PORT = process.env.PORT || 5000;

connectToDatabase()
.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error.message);
});

