import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BudgetTracker from "./pages/BudgetTracker.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";

function App() {
  return (
    <Router>
      <div>
        {/* <h1>Wedding Budget Planning System</h1> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/budget-tracker" element={<BudgetTracker />} />
          <Route path="/header" element={<Header />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/about" element={<About/>} />
          {/* <Route path="/budget-tracker" element={<BudgetTracker />} /> */}


        </Routes>
      </div>
    </Router>
  );
}

export default App;
