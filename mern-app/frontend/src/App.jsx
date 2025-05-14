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
import Services from "./pages/Services.jsx";
import UploadPage from "./pages/Prop&serviceUpload.jsx";
import ManagementDashboard from "./pages/Management.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import MemberView from "./pages/MemberView.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LocationMapView from "./pages/LocationMapView.jsx";
import YourLocations from "./components/YourLocations.jsx";
// import Properties from "./pages/Properties.jsx";
import Advertisement from "./pages/Advertisement.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ContactUs from "./pages/ContactUs.jsx";
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function App() {
  return (
    <Router basename="/">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/location-map" element={<LocationMap />} />
        <Route path="/location-view" element={<LocationMapView />} />
        <Route path="/your-locations" element={<YourLocations />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/advertisement" element={<Advertisement />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        {/* <Route path="/properties" element={<Properties />} /> */}
        <Route path="/upload" element={<UploadPage />} /> {/* Possibly for public property/service uploads; clarify if admin-only */}
        <Route path="/management-dashboard" element={<ManagementDashboard />} /> {/* Kept as per request; may overlap with AdminPropertyServiceList */}
        <Route path="/header" element={<Header />} /> {/* Kept as per request; likely unnecessary as Header is included in layout */}
        <Route path="/footer" element={<Footer />} /> {/* Kept as per request; likely unnecessary as Footer is included in layout */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Public dashboard; may conflict with PrivateRoute version */}

        {/* Authenticated Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} /> {/* Private dashboard; takes precedence over public /dashboard */}
          <Route path="/member-view/:userId" element={<MemberView />} /> {/* User-specific view */}
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Handles ?tab=Property-service for property/service management */}
          <Route path="/view-employee-details/:empId" element={<AdminViewEmployeeDetails />} />
          <Route path="/member-view/:userId" element={<MemberView />} /> {/* Kept as per request; may overlap with PrivateRoute version */}
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;