import { useState } from "react"; // Import useState
import "../styles/navbar.css";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar-custom">
      <div className="search-box">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            placeholder="Search health topics..."
            className="form-control border-start-0 ps-0 shadow-none"
          />
        </div>
      </div>

      <div className="nav-icons">
        <div className="icon-badge">
          <i className="bi bi-bell"></i>
          <span className="badge-dot"></span>
        </div>

        {/* Clickable Profile Section */}
        <div 
          className="profile-wrapper" 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="profile-info d-none d-md-block">
            <span className="user-name">Ayush Chaurasia</span>
          </div>
          <div className="profile">
            <img src="https://i.pravatar.cc/40" alt="profile" />
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <strong>Ayush Chaurasia</strong>
                <p>ayush@example.com</p>
              </div>
              <hr />
              <ul>
                <li><i className="bi bi-person"></i> My Profile</li>
                <li><i className="bi bi-gear"></i> Account Settings</li>
                <li><i className="bi bi-shield-check"></i> Health Records</li>
                <hr />
                <li className="logout-text"><i className="bi bi-box-arrow-right"></i> Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;