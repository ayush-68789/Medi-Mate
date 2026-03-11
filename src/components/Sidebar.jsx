import "../styles/sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h4 className="logo">💚 Medi-Mate</h4>

      <ul className="menu">
        <li>
          <NavLink to="/" end>
            <i className="bi bi-house"></i> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/symptoms">
            <i className="bi bi-activity"></i> Symptom Checker
          </NavLink>
        </li>

        <li>
          <NavLink to="/reports">
            <i className="bi bi-file-earmark-text"></i> Report Analyzer
          </NavLink>
        </li>

        <li>
          <NavLink to="/cycle">
            <i className="bi bi-heart"></i> Cycle Tracker
          </NavLink>
        </li>
      </ul>

      <div className="help-box mt-auto">
        <p><b>Need help?</b></p>
        <small>Our AI is here to explain things simply.</small>
      </div>
    </div>
  );
}

export default Sidebar;