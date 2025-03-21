import PropertyService from '../models/propertyService.model.js';

// Controller function to find combinations based on user input
export const findCombinations = async (req, res) => {
    try {
        const { budget, location, categories } = req.body;
        // findCombinations
        if (!budget || !location || !categories || categories.length === 0) {
            return res.status(400).json({ 
                error: "Required fields are missing. Please provide budget, location, and at least one category." 
            });
        }

        // Convert budget to a number
        const maxBudget = Number(budget);
        
        // Find all services that match the selected location and categories
        const matchingServices = await PropertyService.find({
            location: location,
            category: { $in: categories }
        });

        // Group services by category to get best options per category
        const servicesByCategory = {};
        
        for (const service of matchingServices) {
            if (!servicesByCategory[service.category]) {
                servicesByCategory[service.category] = [];
            }
            servicesByCategory[service.category].push(service);
        }
        
        // Sort services in each category by price
        for (const category in servicesByCategory) {
            servicesByCategory[category].sort((a, b) => a.price - b.price);
        }
        
        // Check if we have services for all selected categories
        const missingCategories = categories.filter(
            category => !servicesByCategory[category] || servicesByCategory[category].length === 0
        );
        
        if (missingCategories.length > 0) {
            return res.status(200).json({
                status: "partial",
                message: `No services found for the following categories in ${location}: ${missingCategories.join(", ")}`,
                availableCategories: Object.keys(servicesByCategory),
                missingCategories
            });
        }
        
        // Generate min price combination
        const minPriceCombination = {};
        let minTotalPrice = 0;
        
        for (const category of categories) {
            const cheapestService = servicesByCategory[category][0];
            minPriceCombination[category] = cheapestService;
            minTotalPrice += cheapestService.price;
        }
        
        // Check if minimum combination exceeds budget
        if (minTotalPrice > maxBudget) {
            return res.status(200).json({
                status: "no_combination",
                message: "No combination found within your budget.",
                minPriceCombination: null,
                maxPriceCombination: null,
                minTotalPrice
            });
        }
        
        // Generate max price combination (without exceeding budget)
        const maxPriceCombination = {};
        let maxTotalPrice = 0;
        let remainingBudget = maxBudget;
        
        // Sort categories by potential price impact (highest price difference first)
        const sortedCategories = [...categories].sort((a, b) => {
            const aServices = servicesByCategory[a];
            const bServices = servicesByCategory[b];
            const aDiff = aServices[aServices.length - 1].price - aServices[0].price;
            const bDiff = bServices[bServices.length - 1].price - bServices[0].price;
            return bDiff - aDiff;
        });
        
        // First add all minimum price services
        for (const category of sortedCategories) {
            const cheapestService = servicesByCategory[category][0];
            maxPriceCombination[category] = cheapestService;
            maxTotalPrice += cheapestService.price;
            remainingBudget -= cheapestService.price;
        }
        
        // Then try to upgrade each category to more expensive options
        for (const category of sortedCategories) {
            const services = servicesByCategory[category];
            let currentService = maxPriceCombination[category];
            
            // Try to find a more expensive service that fits the remaining budget
            for (let i = 1; i < services.length; i++) {
                const service = services[i];
                const priceDifference = service.price - currentService.price;
                
                if (priceDifference <= remainingBudget) {
                    remainingBudget -= priceDifference;
                    maxTotalPrice += priceDifference;
                    maxPriceCombination[category] = service;
                    currentService = service;
                } else {
                    break; // No more services fit in the budget
                }
            }
        }
        
        // Return the combinations
        return res.status(200).json({
            status: "success",
            minPriceCombination: Object.keys(minPriceCombination).map(category => ({
                category,
                service: minPriceCombination[category]
            })),
            maxPriceCombination: Object.keys(maxPriceCombination).map(category => ({
                category,
                service: maxPriceCombination[category]
            })),
            minTotalPrice,
            maxTotalPrice
        });
        
    } catch (error) {
        console.error("Error finding combinations:", error);
        return res.status(500).json({ error: "Server error occurred while finding combinations." });
    }
};

export const getAllPropertyServices = async (req, res) => {
    try {
        const propertyServices = await PropertyService.find(); // Fetch all documents
        res.status(200).json(propertyServices);
    } catch (error) {
        console.error("Error fetching property services:", error);
        res.status(500).json({ error: "Server error occurred while fetching property services." });
    }
};