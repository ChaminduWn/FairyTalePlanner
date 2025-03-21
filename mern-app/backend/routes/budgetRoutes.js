import express from 'express';
import { findCombinations, getAllPropertyServices } from '../controllers/budgetController.js';

const router = express.Router();

// POST route to find wedding package combinations
router.post('/combinations', findCombinations);
router.get('/property-services', getAllPropertyServices);

export default router;