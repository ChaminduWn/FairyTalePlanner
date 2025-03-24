import express from 'express';
import { 
  getAllLocations, 
  getLocationsByCategory, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from '../controllers/locationController.js';

const router = express.Router();

router.get('/', getAllLocations);
router.get('/category/:category', getLocationsByCategory);
router.post('/', createLocation);
router.patch('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;