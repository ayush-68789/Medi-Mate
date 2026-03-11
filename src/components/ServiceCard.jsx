import { Link } from "react-router-dom";

function ServiceCard({ icon, title, desc, path }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="service-card">
        <div className="card-content">
          <div className="icon-box">
            <i className={`bi ${icon}`}></i>
          </div>
          <h5 className="service-title">{title}</h5>
          <p className="service-desc">{desc}</p>
        </div>
        <div className="card-footer-action">
          {/* This Link uses the 'path' sent from Dashboard.jsx */}
          <Link to={path} className="tool-link">
            Launch Tool <i className="bi bi-arrow-right-short"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard; // This line fixes your error!w