import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="card-grid">

        <Link to="/admin/notes" className="dash-card">
          <span className="dash-icon">📝</span>
          <h3>Notes</h3>
          <p>Jegyzetek, feladatok, ügyek.</p>
        </Link>

        <Link to="/admin/jobs" className="dash-card">
          <span className="dash-icon">🧰</span>
          <h3>Jobs</h3>
          <p>Eseti munkák, kiszállások.</p>
        </Link>

       <Link to="/admin/toDo" className="dash-card">
          <span className="dash-icon">📅</span>
          <h3>Jobs by Contract</h3>
          <p>Szerződéses, jővőbeli esedékes munkák.</p>
        </Link>

        <Link to="/admin/contracts" className="dash-card">
          <span className="dash-icon">📄</span>
          <h3>Contracts</h3>
          <p>Szerződések és dokumentumok.</p>
        </Link>

        <Link to="/admin/locations" className="dash-card">
          <span className="dash-icon">📍</span>
          <h3>Locations</h3>
          <p>Helyszínek és címek.</p>
        </Link>

        <Link to="/admin/customers" className="dash-card">
          <span className="dash-icon">👥</span>
          <h3>Customers</h3>
          <p>Ügyfelek és kapcsolatok.</p>
        </Link>

        <Link to="/admin/services" className="dash-card">
          <span className="dash-icon">🧪</span>
          <h3>Services</h3>
          <p>Szolgáltatások, termékek.</p>
        </Link>

        <Link to="/admin/activities" className="dash-card">
          <span className="dash-icon">🐞</span>
          <h3>Activities</h3>
          <p>Tevékenységek és részletek.</p>
        </Link>

        <Link to="/admin/owner" className="dash-card">	
          <span className="dash-icon">👤</span>	
          <h3>Owner</h3>	
          <p>Üzemeltetői adatok.</p>	
        </Link>	

      {/* ÚJ: LandingPage kártya */}
        <Link to="/" className="dash-card">
          <span className="dash-icon">🏡</span>
          <h3>Landing Page</h3>
          <p>Vissza a publikus főoldalra.</p>
        </Link>

      </div>
    </div>
  );
}
