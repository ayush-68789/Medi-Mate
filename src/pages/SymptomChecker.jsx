import "../styles/form.css";

function SymptomChecker() {
  return (
    <div className="form-container">

      <h2 className="mb-4">Symptom Checker</h2>

      <div className="form-card">

        <form>

          {/* Age */}

          <div className="mb-3">
            <label className="form-label">Age</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter your age"
            />
          </div>


          {/* Gender */}

          <div className="mb-3">
            <label className="form-label">Gender</label>

            <select className="form-select">

              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>

            </select>

          </div>


          {/* Symptoms */}

          <div className="mb-3">
            <label className="form-label">Symptoms</label>

            <input
              type="text"
              className="form-control"
              placeholder="Example: Fever, headache"
            />
          </div>


          {/* Duration */}

          <div className="mb-3">
            <label className="form-label">
              How long have you had this symptom?
            </label>

            <select className="form-select">

              <option>Select duration</option>
              <option>1 Day</option>
              <option>2-3 Days</option>
              <option>1 Week</option>
              <option>More than 1 Week</option>

            </select>

          </div>


          {/* Button */}

          <button className="btn btn-success">
            Analyze Symptoms
          </button>

        </form>

      </div>

      <div className="result-card">

      <h5>AI Health Insight</h5>

      <p>
        Based on your symptoms, you may be experiencing a mild
        infection or fatigue. Consider rest, hydration, and
        consult a healthcare professional if symptoms persist.
      </p>

    </div>

    </div>
  );
}

export default SymptomChecker;