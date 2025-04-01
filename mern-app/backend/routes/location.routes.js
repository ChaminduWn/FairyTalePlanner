import express from 'express';
import {
  getAllLocations,
  getLocationsByCategory,
  submitLocationRequest,
  getPendingLocations,
  approveLocation,
  rejectLocation,
  updateLocation,
  deleteLocation,
  getUserLocations
} from '../controllers/locationController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Public routes - these will be accessed as /api/location/...
router.get('/', getAllLocations);
router.get('/category/:category', getLocationsByCategory);

// User authenticated routes
router.post('/request', verifyToken, submitLocationRequest);
router.get('/user', verifyToken, getUserLocations);
router.delete('/user/:id', verifyToken, deleteLocation); // User can delete their own locations

export default router;

// Creating a separate router for admin routes
// These will be accessed as /api/admin/locations/...
export const adminRouter = express.Router();

adminRouter.get('/locations/pending', verifyToken, getPendingLocations);
adminRouter.put('/locations/approve/:id', verifyToken, approveLocation);
adminRouter.put('/locations/reject/:id', verifyToken, rejectLocation);
adminRouter.put('/locations/:id', verifyToken, updateLocation);
adminRouter.delete('/locations/:id', verifyToken, deleteLocation);