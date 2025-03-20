import PropertyService from "../models/propertyService.model.js";

export const getBudgetCombinations = async (req, res) => {
    try {
        const { budget, location, categories } = req.query;

        // Input validation
        if (!budget || !location || !categories) {
            return res.status(400).json({ error: "Budget, location, and categories are required" });
        }

        const parsedBudget = parseFloat(budget);
        if (isNaN(parsedBudget) || parsedBudget <= 0) {
            return res.status(400).json({ error: "Budget should be a valid positive number" });
        }

        const selectedCategories = categories.split(",");
        if (selectedCategories.length === 0) {
            return res.status(400).json({ error: "At least one category is required" });
        }

        // Fetch services/properties based on user-selected location and categories
        const availableServices = await PropertyService.find({
            location,
            category: { $in: selectedCategories }
        });

        // If no services found
        if (availableServices.length === 0) {
            return res.status(404).json({ message: "No services found for the selected location and categories" });
        }

        let allCombinations = [];
        availableServices.forEach(service => {
            let totalCost = service.price;
            if (totalCost <= parsedBudget) {
                allCombinations.push({
                    name: service.name,
                    category: service.category,
                    totalCost
                });
            }
        });

        // If no valid combinations found
        if (allCombinations.length === 0) {
            return res.status(404).json({ message: "No combinations found within the specified budget" });
        }

        // Sort combinations by cost (lowest first)
        allCombinations.sort((a, b) => a.totalCost - b.totalCost);

        res.json({
            least_expensive: allCombinations[0],
            most_expensive: allCombinations[allCombinations.length - 1]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
