import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
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
import Services from "./pages/Services.jsx";


function App() {
  return (
    <BrowserRouter>
          <Header />

        {/* <h1>Wedding Budget Planning System</h1> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/budget-tracker" element={<BudgetTracker />} />
          <Route path="/header" element={<Header />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/about" element={<About/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/location-map" element={<LocationMap/>} />
          <Route path="/employee-login" element={<EmployeeLogin />} />


          {/* <Route path="/budget-tracker" element={<BudgetTracker />} /> */}
          

        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route
            path="/view-employee-details/:empId"
            element={<AdminViewEmployeeDetails />}
          />

        </Route>

        </Routes>
        <Footer />

    </BrowserRouter>
  );
}

export default App;
