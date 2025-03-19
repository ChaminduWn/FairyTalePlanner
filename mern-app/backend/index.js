import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import BudgetRoutes from './routes/budgetRoutes.js';

dotenv.config();   

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is Connected');
  })
  .catch((err) => {
    console.log(err);
  }); 

// Routes
app.use("/api/budget", BudgetRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// Start Server (should be at the bottom)
app.listen(4000, () => {
  console.log('Server is running on port 4000!!');
});
