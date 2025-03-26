import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BudgetTracker from "./pages/BudgetTracker.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./pages/DashBoard.jsx";

import About from "./pages/About.jsx";
import LocationMap from "./pages/LocationMap.jsx";
import EmployeeLogin from "./pages/EmployeeLogin.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoutes.jsx";
import AdminDashboard from "./pages/AdminDashborad.jsx";
import AdminViewEmployeeDetails from "./components/AdminViewEmployeeDetails.jsx";
import Services from "./pages/Services.jsx";
import PropertiesPage from "./pages/Properies.jsx";
import UploadPage from "./pages/Prop&serviceUpload.jsx";
import ManagementDashboard from "./pages/Management.jsx";
import Advertisement from "./pages/Advertisement.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import MemberView from "./pages/MemberView.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LocationMapView from "./pages/LocationMapView.jsx";

function App() {
  return (
    

       
    <Router basename="/">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />

        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/about" element={<About />} />
        <Route path="/location-map" element={<LocationMap />} />
        <Route path="/location-view" element={<LocationMapView />} />

        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/advertisement" element={<Advertisement />} />
        <Route path="/services" element={<Services/>} />
          <Route path="/properties" element={<PropertiesPage/>} />
          <Route path="/upload" element={<UploadPage/>} />
          <Route path="/management-dashboard" element={<ManagementDashboard/>} />




        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member-view/:userId" element={<MemberView />} />
        </Route>

        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/view-employee-details/:empId"
            element={<AdminViewEmployeeDetails />}
          />

<Route path="/member-view/:userId" element={<MemberView />} />

        </Route>
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
