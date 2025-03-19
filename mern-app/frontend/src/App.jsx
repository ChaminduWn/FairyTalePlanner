import { Routes, Route } from "react-router-dom";
import BudgetTracker from "./BudgetTracker.jsx";

function App() {
  return (
    <div>
      <h1>Wedding Budget Planning System</h1>
      <Routes>
        <Route path="/" element={<BudgetTracker />} />
      </Routes>
    </div> 
  );
}

export default App;
