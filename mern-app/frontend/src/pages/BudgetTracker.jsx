import React, { useState, useRef } from "react";
import { Button, Label, TextInput, Select, Checkbox, Spinner, Alert, Card, Badge } from "flowbite-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const WeddingPackage = () => {
    const [budget, setBudget] = useState("");
    const [location, setLocation] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    
    // Separate ref for PDF content to make it hidden from normal view
    const pdfContentRef = useRef(null);

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
        "Honeymoon", "Hotel",
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

            // Generate sample packages (between min and max)
            const samplePackages = generateSamplePackages(servicesByCategory, budget, minCombination, maxCombination);

            setResults({
                minCombination,
                maxCombination: maxTotal > budget ? [] : maxCombination,
                minTotal,
                maxTotal,
                samplePackages
            });
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to generate sample packages between min and max
    const generateSamplePackages = (servicesByCategory, budget, minCombination, maxCombination) => {
        let samplePackages = [];
        
        // Try to generate up to 3 sample packages
        for (let attempt = 0; attempt < 3; attempt++) {
            let sampleCombination = [];
            let sampleTotal = 0;
            
            Object.keys(servicesByCategory).forEach((category) => {
                const servicesInCategory = servicesByCategory[category];
                
                if (servicesInCategory.length > 2) {
                    // Select a service that's not the min or max for this category
                    const nonMinMaxServices = servicesInCategory.filter(
                        service => 
                            !minCombination.some(s => s.name === service.name) && 
                            !maxCombination.some(s => s.name === service.name)
                    );
                    
                    if (nonMinMaxServices.length > 0) {
                        // Pick a random service from the middle range
                        const midIndex = Math.floor(attempt * nonMinMaxServices.length / 3);
                        const selectedService = nonMinMaxServices[midIndex] || nonMinMaxServices[0];
                        
                        if (sampleTotal + selectedService.price <= budget) {
                            sampleCombination.push(selectedService);
                            sampleTotal += selectedService.price;
                        } else {
                            // If too expensive, add the min price option
                            const minService = servicesInCategory[0];
                            sampleCombination.push(minService);
                            sampleTotal += minService.price;
                        }
                    } else {
                        // If no middle options, add a random service that fits in budget
                        const randomIndex = Math.floor(Math.random() * servicesInCategory.length);
                        const selectedService = servicesInCategory[randomIndex];
                        
                        if (sampleTotal + selectedService.price <= budget) {
                            sampleCombination.push(selectedService);
                            sampleTotal += selectedService.price;
                        }
                    }
                } else {
                    // If only 1 or 2 services in category, pick one randomly
                    const selectedService = servicesInCategory[attempt % servicesInCategory.length];
                    
                    if (sampleTotal + selectedService.price <= budget) {
                        sampleCombination.push(selectedService);
                        sampleTotal += selectedService.price;
                    }
                }
            });
            
            // Only add the sample if it's different from existing packages and within budget
            if (sampleCombination.length > 0 && sampleTotal <= budget) {
                // Check if this sample is unique
                const isDuplicate = samplePackages.some(
                    (pkg) => 
                        JSON.stringify(pkg.combination.map(s => s.name).sort()) === 
                        JSON.stringify(sampleCombination.map(s => s.name).sort())
                );
                
                if (!isDuplicate) {
                    samplePackages.push({
                        combination: sampleCombination,
                        total: sampleTotal
                    });
                }
            }
        }
        
        return samplePackages;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('si-LK').format(price);
    };
    
    // Function to download results as PDF
    const downloadPDF = async () => {
        if (!results) return;
        
        setPdfLoading(true);
        
        try {
            // Create PDF directly
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const contentWidth = pageWidth - 20; // 10mm margins on each side
            
            // Add title
            pdf.setFontSize(16);
            pdf.setTextColor(173, 101, 0); // Amber color for title
            pdf.text("Wedding Package Plan", pageWidth / 2, 15, { align: "center" });
            
            // Add horizontal line
            pdf.setDrawColor(220, 220, 220);
            pdf.line(10, 20, pageWidth - 10, 20);
            
            let yPosition = 30;
            const lineHeight = 8;
            
            // Minimum Price Package
            pdf.setFontSize(12);
            pdf.setTextColor(60, 60, 60);
            pdf.text(`Minimum Price Package  LKR ${formatPrice(results.minTotal)}`, 15, yPosition);
            
            yPosition += lineHeight + 5;
            
            // Render minimum price package details
            results.minCombination.forEach((service) => {
                pdf.setFontSize(10);
                pdf.setTextColor(173, 101, 0);
                pdf.text(`${service.category}:`, 30, yPosition);
                
                pdf.setTextColor(60, 60, 60);
                pdf.text(`${service.name} - LKR ${formatPrice(service.price)}`, 90, yPosition);
                
                yPosition += lineHeight;
            });
            
            // Total Price for minimum package
            yPosition += 5;
            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);
            pdf.text("Total Price:", 30, yPosition);
            
            pdf.setTextColor(173, 101, 0);
            pdf.text(`LKR ${formatPrice(results.minTotal)}`, pageWidth - 30, yPosition, { align: "right" });
            
            // Add horizontal line
            yPosition += 5;
            pdf.setDrawColor(220, 220, 220);
            pdf.line(10, yPosition, pageWidth - 10, yPosition);
            
            yPosition += lineHeight + 5;
            
            // Maximum Price Package
            pdf.setFontSize(12);
            pdf.setTextColor(60, 60, 60);
            pdf.text(`Maximum Price Package  LKR ${formatPrice(results.maxTotal)}`, 15, yPosition);
            
            yPosition += lineHeight + 5;
            
            // Render maximum price package details
            if (results.maxCombination && results.maxCombination.length > 0) {
                results.maxCombination.forEach((service) => {
                    pdf.setFontSize(10);
                    pdf.setTextColor(173, 101, 0);
                    pdf.text(`${service.category}:`, 30, yPosition);
                    
                    pdf.setTextColor(60, 60, 60);
                    pdf.text(`${service.name} - LKR ${formatPrice(service.price)}`, 90, yPosition);
                    
                    yPosition += lineHeight;
                });
                
                // Total Price for maximum package
                yPosition += 5;
                pdf.setFontSize(10);
                pdf.setTextColor(60, 60, 60);
                pdf.text("Total Price:", 30, yPosition);
                
                pdf.setTextColor(173, 101, 0);
                pdf.text(`LKR ${formatPrice(results.maxTotal)}`, pageWidth - 30, yPosition, { align: "right" });
            } else {
                pdf.setTextColor(255, 0, 0);
                pdf.text("No valid maximum Package found.", 30, yPosition);
            }
            
            // Add horizontal line
            yPosition += 5;
            pdf.setDrawColor(220, 220, 220);
            pdf.line(10, yPosition, pageWidth - 10, yPosition);
            
            yPosition += lineHeight + 5;
            
            // Sample Package Options
            if (results.samplePackages && results.samplePackages.length > 0) {
                pdf.setFontSize(14);
                pdf.setTextColor(60, 60, 60);
                pdf.text("Sample Package Options", 15, yPosition);
                
                yPosition += lineHeight + 5;
                
                // Render each sample package
                results.samplePackages.forEach((pkg, index) => {
                    // If the content will overflow to the next page, add a new page
                    if (yPosition > 250) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                    
                    pdf.setFontSize(12);
                    pdf.setTextColor(60, 60, 60);
                    pdf.text(`Sample Package ${index + 1}  LKR ${formatPrice(pkg.total)}`, 15, yPosition);
                    
                    yPosition += lineHeight + 5;
                    
                    // Render sample package details
                    pkg.combination.forEach((service) => {
                        pdf.setFontSize(10);
                        pdf.setTextColor(173, 101, 0);
                        pdf.text(`${service.category}:`, 30, yPosition);
                        
                        pdf.setTextColor(60, 60, 60);
                        pdf.text(`${service.name} - LKR ${formatPrice(service.price)}`, 90, yPosition);
                        
                        yPosition += lineHeight;
                    });
                    
                    // Total Price for sample package
                    yPosition += 5;
                    pdf.setFontSize(10);
                    pdf.setTextColor(60, 60, 60);
                    pdf.text("Total Price:", 30, yPosition);
                    
                    pdf.setTextColor(173, 101, 0);
                    pdf.text(`LKR ${formatPrice(pkg.total)}`, pageWidth - 30, yPosition, { align: "right" });
                    
                    yPosition += lineHeight + 5;
                });
            }
            
            // If the content will overflow to the next page, add a new page
            if (yPosition > 240) {
                pdf.addPage();
                yPosition = 20;
            }
            
            // Budget Summary
            pdf.setFillColor(255, 250, 230); // Light amber background
            pdf.rect(10, yPosition, pageWidth - 20, 35, 'F');
            
            yPosition += 10;
            
            pdf.setFontSize(12);
            pdf.setTextColor(173, 101, 0);
            pdf.text("Budget Summary", 15, yPosition);
            
            yPosition += lineHeight + 2;
            
            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);
            pdf.text(`Your budget: LKR ${formatPrice(parseInt(budget))}`, 15, yPosition);
            
            yPosition += lineHeight;
            
            pdf.text(`Price range: LKR ${formatPrice(results.minTotal)} - LKR ${formatPrice(results.maxTotal || results.minTotal)}`, 15, yPosition);
            
            yPosition += lineHeight;
            
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            // pdf.text("* Prices may vary based on availability and seasonality.", 15, yPosition);
            
            // Add footer
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text('© Wedding Package Planner - Your Perfect Wedding Solutions', pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });
            
            pdf.save("wedding-package-plan.pdf");
        } catch (error) {
            console.error("Error generating PDF: ", error);
            setError("Failed to generate PDF. Please try again.");
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">Wedding Package Planner</h1>
            <p className="text-center text-gray-600 text-xl mb-8">Find the perfect wedding services combination within your budget</p>

            <div className="bg-white rounded-lg border-t-4 border-gray-200 shadow-md p-6 mb-8">
                <form onSubmit={findCombinations}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <Label htmlFor="budget" value="Your Budget (LKR)" className="text-md" />
                                <TextInput
                                    id="budget"
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="Enter your budget"
                                    required
                                    className="text-md"
                                    min="1000"
                                />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="location" value="Select Location" className="text-md" />
                                <Select
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                    className="text-md"
                                >
                                    <option value="">-- Select a district --</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district} className="text-md">
                                            {district}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label value="Select Categories" className="text-md" />
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto">
                                {categories.map((category) => (
                                    <div key={category} className="flex items-center mb-2 text-md">
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-2"
                                        />
                                        <Label htmlFor={`category-${category}`} value={category} className="text-md"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex justify-center mt-6">
                        <Button type="submit" disabled={loading} color="black" size="lg">
                            {loading ? <Spinner size="sm" className="mr-2" /> : "Find suitable Packages"}
                        </Button>
                    </div> */}

<div className="flex justify-center mt-6">
    <Button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white font-semibold text-lg rounded-md py-1 px-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50"
    >
        {loading ? <Spinner size="sm" className="mr-2" /> : "Find suitable Packages"}
    </Button>
</div>
                </form>
            </div>

            {error && <Alert color="failure" className="mb-4">{error}</Alert>}

            {results && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 pb-3">
                            Packages
                        </h2>
                        <Button 
                            color="amber" 
                            onClick={downloadPDF} 
                            disabled={pdfLoading}
                        >
                            {pdfLoading ? (
                                <>
                                    <Spinner size="sm" className="mr-2" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download as PDF
                                </>
                            )}
                        </Button>
                    </div>

                    <div>
                        {results.status === "no_combination" ? (
                            <p className="text-center text-red-600">No suitable Package found within your budget.</p>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <Card className="mb-6 shadow-md border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-700">Minimum Price Package</h3>
                                            <Badge color="success" size="lg" className="px-3 py-1.5">
                                                LKR {formatPrice(results.minTotal)}
                                            </Badge>
                                        </div>
                                        <div className="mt-4">
                                            {results.minCombination.map((service) => (
                                                <div key={service.name} className="flex justify-between items-center mb-2 p-2 bg-white rounded-lg">
                                                    <div>
                                                        <span className="font-semibold text-amber-600">{service.category}:</span> {service.name} - LKR {formatPrice(service.price)}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                                                <span className="font-semibold">Total Price:</span>
                                                <span className="font-semibold text-amber-600">LKR {formatPrice(results.minTotal)}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="mb-8">
                                    <Card className="mb-6 shadow-md border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-700">Maximum Price Package</h3>
                                            {results.maxCombination.length > 0 ? (
                                                <Badge color="warning" size="lg" className="px-3 py-1.5">
                                                    LKR {formatPrice(results.maxTotal)}
                                                </Badge>
                                            ) : null}
                                        </div>
                                        {results.maxCombination.length > 0 ? (
                                            <div className="mt-4">
                                                {results.maxCombination.map((service) => (
                                                    <div key={service.name} className="flex justify-between items-center mb-2 p-2 bg-white rounded-lg">
                                                        <div>
                                                            <span className="font-semibold text-amber-600">{service.category}:</span> {service.name} - LKR {formatPrice(service.price)}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                                                    <span className="font-semibold">Total Price:</span>
                                                    <span className="font-semibold text-amber-600">LKR {formatPrice(results.maxTotal)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-red-600">No valid maximum Package found.</p>
                                        )}
                                    </Card>
                                </div>

                                {/* Sample Packages Section */}
                                {results.samplePackages && results.samplePackages.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                                            Sample Package Options
                                        </h3>
                                        {/* Remove the grid layout and render each card in full width */}
                                        {results.samplePackages.map((pkg, index) => (
                                            <Card key={index} className="mb-6 shadow-md border border-gray-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-700">Sample Package {index + 1}</h3>
                                                    <Badge color="info" size="lg" className="px-3 py-1.5">
                                                        LKR {formatPrice(pkg.total)}
                                                    </Badge>
                                                </div>
                                                <div className="mt-4">
                                                    {pkg.combination.map((service) => (
                                                        <div key={service.name} className="flex justify-between items-center mb-2 p-2 bg-white rounded-lg">
                                                            <div>
                                                                <span className="font-semibold text-amber-600">{service.category}:</span> {service.name} - LKR {formatPrice(service.price)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                                                        <span className="font-semibold">Total Price:</span>
                                                        <span className="font-semibold text-amber-600">LKR {formatPrice(pkg.total)}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-amber-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-amber-700">Budget Summary</h4>
                                    </div>
                                    <p className="text-gray-700">Your budget: <span className="font-bold">LKR {formatPrice(parseInt(budget))}</span></p>
                                    <p className="text-gray-700">Price range: <span className="font-bold">LKR {formatPrice(results.minTotal)} - LKR {formatPrice(results.maxTotal || results.minTotal)}</span></p>
                                    {/* <p className="text-sm text-gray-500 mt-2">* Prices may vary based on availability and seasonality.</p> */}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeddingPackage;