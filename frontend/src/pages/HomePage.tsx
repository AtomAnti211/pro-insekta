import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Insecta Admin Dashboard</h1>

      <div className="dashboard-grid">

        <Link to="/activities" className="dashboard-card">
          <div className="card-icon">🐞</div>
          <h2>Activities</h2>
          <p>Összes tevékenység megtekintése</p>
        </Link>

        <Link to="/notes" className="dashboard-card">
          <div className="card-icon">📝</div>
          <h2>Notes</h2>
          <p>Jegyzetek és munkalapok</p>
        </Link>

        <Link to="/customers" className="dashboard-card disabled">
          <div className="card-icon">👤</div>
          <h2>Customers</h2>
          <p>Hamarosan…</p>
        </Link>

        <Link to="/locations" className="dashboard-card disabled">
          <div className="card-icon">📍</div>
          <h2>Locations</h2>
          <p>Hamarosan…</p>
        </Link>

      </div>
    </div>
  );
}
