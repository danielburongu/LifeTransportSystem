import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home"; // New Home Page
import PrivacyPolicy from "./pages/PrivacyPolicy"; // New Page
import AboutUs from "./pages/AboutUs"; // New Page
import Contact from "./pages/Contact"; // New Page
import Services from "./pages/Services"; // New Page
import QrLogin from "./pages/QrLogin"; // New QR Login Page
import PoliceDashboard from "./components/PoliceDashboard";
import HospitalDashboard from "./components/HospitalDashboard";
import DriverDashboard from "./components/DriverDashboard";
import PatientDashboard from "./components/PatientDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 container mx-auto px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* New Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/Qr-login" element={<QrLogin />} /> {/* Added QR Login Route */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/patient" element={<PatientDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["police"]} />}>
            <Route path="/police" element={<PoliceDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["hospital_staff"]} />}>
            <Route path="/hospital" element={<HospitalDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ambulance_driver"]} />}>
            <Route path="/driver" element={<DriverDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;