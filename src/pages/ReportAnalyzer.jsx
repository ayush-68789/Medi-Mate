import "../styles/form.css";

function ReportAnalyzer() {
  return (
    <div className="form-container">

      <h2 className="mb-4">Medical Report Analyzer</h2>

      <div className="form-card">

        <form>

          {/* Patient Name */}

          <div className="mb-3">
            <label className="form-label">Patient Name</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter patient name"
            />
          </div>


          {/* Age */}

          <div className="mb-3">
            <label className="form-label">Age</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter age"
            />
          </div>


          {/* Test Type */}

          <div className="mb-3">
            <label className="form-label">Test Type</label>

            <select className="form-select">

              <option>Select Test</option>
              <option>Blood Test</option>
              <option>Urine Test</option>
              <option>X-Ray</option>
              <option>CT Scan</option>

            </select>
          </div>


          {/* Upload Report */}

          <div className="mb-3">
            <label className="form-label">Upload Report</label>

            <input
              type="file"
              className="form-control"
            />
          </div>


          {/* Button */}

          <button className="btn btn-success">
            Analyze Report
          </button>

        </form>

        <div className="report-preview">

        <h5>Report Summary</h5>

        <p>
        Your uploaded report will be analyzed and explained in
        simple language so you can understand each parameter.
        </p>

        </div>

      </div>

    </div>
  );
}

export default ReportAnalyzer;