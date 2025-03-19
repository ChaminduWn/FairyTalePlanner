import express from "express";
import { getBudgetCombinations } from "../controllers/budgetController.js";

const router = express.Router();

router.get("/budget-tracker", getBudgetCombinations);

export default router;