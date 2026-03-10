import "../styles/sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <h4 className="logo">💚 Medi-Mate</h4>

      <ul className="menu">

        <li>
          <Link to="/">
            <i className="bi bi-house"></i> Dashboard
          </Link>
        </li>

        <li>
          <Link to="/symptoms">
            <i className="bi bi-activity"></i> Symptom Checker
          </Link>
        </li>

        <li>
          <Link to="/reports">
            <i className="bi bi-file-earmark-text"></i> Report Analyzer
          </Link>
        </li>

        <li>
          <Link to="/cycle">
            <i className="bi bi-heart"></i> Cycle Tracker
          </Link>
        </li>

      </ul>

      <div className="help-box">
        <p><b>Need help?</b></p>
        <small>Our AI is here to explain things simply.</small>
      </div>

    </div>
  );
}

export default Sidebar;