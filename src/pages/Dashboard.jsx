import "../styles/dashboard.css";
import ServiceCard from "../components/ServiceCard";
import { useNavigate } from "react-router-dom"; // Import the navigation hook

function Dashboard() {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="dashboard-grid">

      {/* LEFT SIDE */}

      <div className="dashboard-main">

        {/* HERO */}
        <div className="hero-card">
          <div className="hero-content">
            <span className="badge-new">
              <i className="bi bi-stars"></i> NOW MULTILINGUAL
            </span>

            <h1 className="hero-title">
              Your Health,
              <br />
              <span className="green-gradient-text">Simply Explained.</span>
            </h1>

            <p className="hero-text">
              Medi-Mate turns complex medical jargon into clear, actionable insights. 
              Check symptoms, analyze reports, and track your health easily—all for free.
            </p>

            <div className="hero-buttons">
              {/* Added onClick to redirect to Symptom Checker */}
              <button 
                className="btn-primary-custom me-3" 
                onClick={() => navigate("/symptoms")}
              >
                Check Symptoms <i className="bi bi-arrow-right-short"></i>
              </button>

              {/* Added onClick to redirect to Report Analyzer */}
              <button 
                className="btn-outline-custom"
                onClick={() => navigate("/reports")}
              >
                <i className="bi bi-file-earmark-medical"></i> Analyze Report
              </button>
            </div>
          </div>
          
          <div className="hero-visual d-none d-lg-block">
            <div className="abstract-shape"></div>
            <i className="bi bi-shield-check hero-icon-bg"></i>
          </div>
        </div>


        {/* SERVICES */}

        <div className="services-section">

          <h4>Health Services</h4>

          <div className="row mt-4">

            {/* Added the 'path' prop to each ServiceCard */}
            <ServiceCard
              icon="bi-activity"
              title="Symptom Checker"
              desc="Understand your symptoms in simple terms."
              path="/symptoms"
            />

            <ServiceCard
              icon="bi-file-earmark-text"
              title="Report Analyzer"
              desc="Upload medical reports and get explanations."
              path="/reports"
            />

            <ServiceCard
              icon="bi-heart"
              title="Cycle Tracker"
              desc="Track your cycle and reproductive health."
              path="/cycle"
            />

          </div>

        </div>

      </div>


      {/* RIGHT PANEL */}

      <div className="dashboard-side">

        {/* Empower Section */}
        <div className="info-card">
          <h5>Empowering Everyone</h5>
          <p>
            Medi-Mate helps both urban and rural users understand
            health information easily.
          </p>

          <div className="stats">
            <div>
              <h3>100%</h3>
              <p>Free Access</p>
            </div>
            <div>
              <h3>4+</h3>
              <p>Languages</p>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="tips-card">
          <h5>💡 Health Tips</h5>
          <ul>
            <li>Drink at least 8 glasses of water daily.</li>
            <li>Sleep 7-8 hours every night.</li>
            <li>Exercise regularly for better immunity.</li>
            <li>Eat fruits and vegetables daily.</li>
          </ul>
        </div>

      </div>
      
    </div>
  );
}

export default Dashboard;