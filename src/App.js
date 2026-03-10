import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import CycleTracker from "./pages/CycleTracker";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app-container">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="page-content">

          <Routes>
            <Route path="/" element={<Dashboard />} />
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