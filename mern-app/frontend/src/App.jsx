import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BudgetTracker from "./pages/BudgetTracker.jsx";

function App() {
  return (
    <Router>
      <div>
        <h1>Wedding Budget Planning System</h1>
        <Routes>
          <Route path="/" element={<BudgetTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
