import "../styles/dashboard.css";
import ServiceCard from "../components/ServiceCard";

function Dashboard() {
  return (
    <div className="dashboard-grid">

      {/* LEFT SIDE */}

      <div className="dashboard-main">

        {/* HERO */}

        <div className="hero-card">

          <span className="badge bg-light text-success">
            NOW MULTILINGUAL
          </span>

          <h1 className="hero-title">
            Your Health,
            <br />
            <span className="green">Simply Explained.</span>
          </h1>

          <p className="hero-text">
            Medi-Mate turns complex medical jargon into clear,
            actionable insights. Check symptoms, analyze reports,
            and track your health easily.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-success me-3">
              Check Symptoms
            </button>

            <button className="btn btn-outline-secondary">
              Analyze Report
            </button>
          </div>

        </div>


        {/* SERVICES */}

        <div className="services-section">

          <h4>Health Services</h4>

          <div className="row mt-4">

            <ServiceCard
              icon="bi-activity"
              title="Symptom Checker"
              desc="Understand your symptoms in simple terms."
            />

            <ServiceCard
              icon="bi-file-earmark-text"
              title="Report Analyzer"
              desc="Upload medical reports and get explanations."
            />

            <ServiceCard
              icon="bi-heart"
              title="Cycle Tracker"
              desc="Track your cycle and reproductive health."
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