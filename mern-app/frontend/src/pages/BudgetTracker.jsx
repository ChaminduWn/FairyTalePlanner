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

    const fetchOptions = async () => {
        const response = await fetch(`/api/budget-tracker?budget=${budget}&location=${location}&categories=${selectedCategories.join(",")}`);
        const data = await response.json();
        setResults(data);
    };

    return (
        <div className="p-5">
            <h2>Budget Tracker</h2>
            <input type="number" placeholder="Enter Budget" onChange={(e) => setBudget(e.target.value)} />
            
            <select onChange={(e) => setLocation(e.target.value)}>
                {districts.map((dist, index) => (
                    <option key={index} value={dist}>{dist}</option>
                ))}
            </select>
            
            <div>
                {categories.map((cat, index) => (
                    <label key={index}>
                        <input type="checkbox" value={cat} onChange={(e) => setSelectedCategories([...selectedCategories, e.target.value])} /> {cat}
                    </label>
                ))}
            </div>
            
            <button onClick={fetchOptions}>Find Options</button>
            
            {results && (
                <div>
                    <h3>Least Expensive Option:</h3>
                    <p>{results.least_expensive.name} - {results.least_expensive.category} (LKR {results.least_expensive.totalCost})</p>
                    <h3>Most Expensive Option:</h3>
                    <p>{results.most_expensive.name} - {results.most_expensive.category} (LKR {results.most_expensive.totalCost})</p>
                </div>
            )}
        </div>
    );
};

export default BudgetTracker;
