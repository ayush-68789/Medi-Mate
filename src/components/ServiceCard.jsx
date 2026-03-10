function ServiceCard({ icon, title, desc }) {
  return (
    <div className="col-md-4">

      <div className="service-card">

        <div className="icon-box">
          <i className={`bi ${icon}`}></i>
        </div>

        <h5>{title}</h5>

        <p className="text-muted">{desc}</p>

        <a href="#">Launch Tool →</a>

      </div>

    </div>
  );
}

export default ServiceCard;