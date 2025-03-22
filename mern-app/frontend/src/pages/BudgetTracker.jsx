import React, { useState } from "react";
import { Button, Label, TextInput, Select, Checkbox, Spinner, Alert } from "flowbite-react";

const WeddingPackage = () => {
    const [budget, setBudget] = useState("");
    const [location, setLocation] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
        "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
        "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
        "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
        "Trincomalee", "Vavuniya",
    ];

    const categories = [
        "Photography", "Bridal Service", "Photo Location", "Groom Dressing",
        "Car Rental", "Entertainment Services", "Invitation & Gift Services",
        "Private Villa", "Hotel",
    ];

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    const findCombinations = async (e) => {
        e.preventDefault();

        if (!budget || !location || selectedCategories.length === 0) {
            setError("Please enter your budget, select a location, and choose at least one category.");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            // Fetch property services data
            const response = await fetch("http://localhost:4000/api/property-services");
            const allServices = await response.json();

            if (!response.ok) throw new Error("Failed to fetch services");

            // Filter services based on user's selection
            const filteredServices = allServices.filter(
                (service) =>
                    service.location === location && selectedCategories.includes(service.category)
            );

            if (filteredServices.length === 0) {
                setResults({ status: "no_combination" });
                return;
            }

            // Group services by category
            const servicesByCategory = {};
            filteredServices.forEach((service) => {
                if (!servicesByCategory[service.category]) {
                    servicesByCategory[service.category] = [];
                }
                servicesByCategory[service.category].push(service);
            });

            // Find min and max price Packages
            let minCombination = [];
            let maxCombination = [];
            let minTotal = 0;
            let maxTotal = 0;

            Object.keys(servicesByCategory).forEach((category) => {
                const sortedByPrice = servicesByCategory[category].sort((a, b) => a.price - b.price);

                // Find the cheapest and most expensive service in this category
                const minService = sortedByPrice[0];
                const maxService = sortedByPrice[sortedByPrice.length - 1];

                minCombination.push(minService);
                minTotal += minService.price;

                if (maxTotal + maxService.price <= budget) {
                    maxCombination.push(maxService);
                    maxTotal += maxService.price;
                }
            });

            // Ensure both combinations do not exceed the budget
            if (minTotal > budget) {
                setResults({ status: "no_combination" });
                return;
            }

            setResults({
                minCombination,
                maxCombination: maxTotal > budget ? [] : maxCombination,
                minTotal,
                maxTotal,
            });
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-amber-600 mb-2">Wedding Package Planner</h1>
            <p className="text-center text-gray-600 mb-8">Find the perfect wedding services combination within your budget</p>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <form onSubmit={findCombinations}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <Label htmlFor="budget" value="Your Budget (LKR)" />
                                <TextInput
                                    id="budget"
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="Enter your budget"
                                    required
                                    min="1000"
                                />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="location" value="Select Location" />
                                <Select
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select a district --</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label value="Select Categories" />
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto">
                                {categories.map((category) => (
                                    <div key={category} className="flex items-center mb-2">
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-2"
                                        />
                                        <Label htmlFor={`category-${category}`} value={category} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button type="submit" disabled={loading} color="warning" size="lg">
                            {loading ? <Spinner size="sm" className="mr-2" /> : "Find suitable Packages "}
                        </Button>
                    </div>
                </form>
            </div>

            {error && <Alert color="failure" className="mb-4">{error}</Alert>}

            {results && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 pb-3 border-b border-gray-200">
                        Packages
                    </h2>

                    {results.status === "no_combination" ? (
                        <p className="text-center text-red-600">No suitable Package found within your budget.</p>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700">Minimum Price Package</h3>
                                <div className="mt-4">
                                    {results.minCombination.map((service) => (
                                        <div key={service.name} className="flex justify-between items-center mb-2">
                                            <div>
                                                <span className="font-semibold text-amber-600">{service.category}:</span> {service.name} - LKR {service.price}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                                        <span className="font-semibold">Total Price:</span>
                                        <span className="font-semibold text-amber-600">LKR {results.minTotal}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Maximum Price Package</h3>
                                {results.maxCombination.length > 0 ? (
                                    <div className="mt-4">
                                        {results.maxCombination.map((service) => (
                                            <div key={service.name} className="flex justify-between items-center mb-2">
                                                <div>
                                                    <span className="font-semibold text-amber-600">{service.category}:</span> {service.name} - LKR {service.price}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                                            <span className="font-semibold">Total Price:</span>
                                            <span className="font-semibold text-amber-600">LKR {results.maxTotal}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-600">No valid maximum Package found.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default WeddingPackage;