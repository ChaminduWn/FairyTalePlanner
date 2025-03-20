import { useState } from "react";

const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const categories = ["Photography", "Bridal Service", "Photo Location", "Groom Dressing", "Car Rental", "Entertainment Services", "Invitation & Gift Services", "Private Villa"];

const BudgetTracker = () => {
    const [budget, setBudget] = useState("");
    const [location, setLocation] = useState("Colombo");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState(null);

    // Handles category selection and deselection
    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((cat) => cat !== category); // Remove category if already selected
            } else {
                return [...prevCategories, category]; // Add category if not selected
            }
        });
    };

    const fetchOptions = async () => {
        if (!budget || selectedCategories.length === 0) {
            alert("Please provide a valid budget and select at least one category.");
            return;
        }

        try {
            const response = await fetch(`/api/budget-tracker?budget=${budget}&location=${location}&categories=${selectedCategories.join(",")}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching options:", error);
            alert("There was an error fetching the options. Please try again later.");
        }
    };

    return (
        <div className="p-5">
            <h2>Budget Tracker</h2>
            
            {/* Budget Input */}
            <input 
                type="number" 
                placeholder="Enter Budget" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)} 
            />

            {/* Location Dropdown */}
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                {districts.map((dist, index) => (
                    <option key={index} value={dist}>{dist}</option>
                ))}
            </select>

            {/* Categories Checkboxes */}
            <div>
                {categories.map((cat, index) => (
                    <label key={index}>
                        <input 
                            type="checkbox" 
                            value={cat} 
                            checked={selectedCategories.includes(cat)} 
                            onChange={() => handleCategoryChange(cat)} 
                        /> 
                        {cat}
                    </label>
                ))}
            </div>

            {/* Find Options Button */}
            <button onClick={fetchOptions}>Find Options</button>

            {/* Display Results */}
            {results && (
                <div>
                    <h3>Least Expensive Option:</h3>
                    {results.least_expensive ? (
                        <p>{results.least_expensive.name} - {results.least_expensive.category} (LKR {results.least_expensive.totalCost})</p>
                    ) : (
                        <p>No least expensive option found</p>
                    )}
                    
                    <h3>Most Expensive Option:</h3>
                    {results.most_expensive ? (
                        <p>{results.most_expensive.name} - {results.most_expensive.category} (LKR {results.most_expensive.totalCost})</p>
                    ) : (
                        <p>No most expensive option found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BudgetTracker;
