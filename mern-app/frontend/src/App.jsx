import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BudgetTracker from "./pages/BudgetTracker.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import LocationMap from "./pages/LocationMap.jsx";
import EmployeeLogin from "./pages/EmployeeLogin.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoutes.jsx";
import AdminDashboard from "./pages/AdminDashborad.jsx";
import AdminViewEmployeeDetails from "./components/AdminViewEmployeeDetails.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

function App() {
  return (
    <Router basename="/">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/about" element={<About />} />
        <Route path="/location-map" element={<LocationMap />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/view-employee-details/:empId"
            element={<AdminViewEmployeeDetails />}
          />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
