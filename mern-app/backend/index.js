import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import BudgetRoutes from './routes/budgetRoutes.js';
import LocationsRoutes from './routes/locationsRoutes.js';
import authEmployeeRoutes from './routes/authEmployee.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import advertisment from './routes/advertismentRoutes.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

// Define __dirname for ES modules (MOVED UP)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist (MOVED UP)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is Connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // If you're using cookies
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(4000, () => {
  console.log('Server is running on port 4000!!');
});

// Routes

app.use("/api/budget", BudgetRoutes);
app.use("/api/location", LocationsRoutes);
app.use("/api/employee", employeeRoutes);  
app.use("/api/authEmployeeRoutes", authEmployeeRoutes); 
app.use("/api/advertisement", advertisment);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

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
