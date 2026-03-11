import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import CycleTracker from "./pages/CycleTracker";
import Login from "./pages/login"; 

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  // Check if the current page is the Login page
  const isLoginPage = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="app-container">
      {/* Only show Sidebar if NOT on the login page */}
      {!isLoginPage && <Sidebar />}

      <div className={isLoginPage ? "auth-content" : "main-content"}>
        {/* Only show Navbar if NOT on the login page */}
        {!isLoginPage && <Navbar />}

        <div className={isLoginPage ? "auth-page" : "page-content"}>
          <Routes>
            {/* Login is the landing page */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route path="/reports" element={<ReportAnalyzer />} />
            <Route path="/cycle" element={<CycleTracker />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;