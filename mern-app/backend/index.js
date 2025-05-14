import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import BudgetRoutes from './routes/budgetRoutes.js';
import authEmployeeRoutes from './routes/authEmployee.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import advertisment from './routes/advertismentRoutes.js';
import LocationsRoutes, { adminRouter as LocationsAdminRoutes } from './routes/location.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import propertyServiceRoutes from './routes/propertyServiceRoute.js'; // Added

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const uploadsDir = path.join(dirname, 'Uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(UploadsDir, { recursive: true });
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
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(dirname, 'Uploads')));

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
app.use('/api/propertyService', propertyServiceRoutes); // Added
app.use("/api/admin", LocationsAdminRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});