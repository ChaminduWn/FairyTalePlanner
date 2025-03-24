import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import BudgetRoutes from './routes/budgetRoutes.js';
import authEmployeeRoutes from './routes/authEmployee.routes.js';
import employeeRoutes from './routes/employee.routes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is Connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/", BudgetRoutes);
app.use("/api/employee", employeeRoutes);  
app.use("/api/authEmployeeRoutes", authEmployeeRoutes); 

// ✅ FIXED: Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// ✅ Start Server
app.listen(4000, () => {
  console.log('Server is running on port 4000!!');
});
