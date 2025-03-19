// Backend - Controller (budgetController.js)
import PropertyService from "../models/propertyService.model.js";

export const getBudgetCombinations = async (req, res) => {
    try {
        const { budget, location, categories } = req.query;
        const selectedCategories = categories.split(",");
        
        // Fetch services/properties based on user-selected location and categories
        const availableServices = await PropertyService.find({
            location,
            category: { $in: selectedCategories }
        });
        
        let allCombinations = [];
        availableServices.forEach(service => {
            let totalCost = service.price;
            if (totalCost <= budget) {
                allCombinations.push({
                    name: service.name,
                    category: service.category,
                    totalCost
                });
            }
        });

        // Sort combinations by cost (lowest first)
        allCombinations.sort((a, b) => a.totalCost - b.totalCost);

        res.json({
            least_expensive: allCombinations[0] || "No combination found",
            most_expensive: allCombinations[allCombinations.length - 1] || "No combination found"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};