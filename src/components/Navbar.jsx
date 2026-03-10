import "../styles/navbar.css";
function Navbar() {
  return (
    <div className="navbar-custom">

      <div className="search-box">
        <input
          type="text"
          placeholder="Search health topics..."
          className="form-control"
        />
      </div>

      <div className="nav-icons">

        <i className="bi bi-bell"></i>

        <div className="profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
          />
        </div>

      </div>

    </div>
  );
}

export default Navbar;