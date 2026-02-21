import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout-container">

      <nav className={`sidebar ${open ? "expanded" : "collapsed"}`}>
        
        <button 
          className="sidebar-toggle"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <ul className="sidebar-menu">

          <li>
            <Link to="/" data-tooltip="Dashboard">
              <span className="icon">🏠</span>
              {open && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link to="/notes" data-tooltip="Notes">
              <span className="icon">📝</span>
              {open && <span>Notes</span>}
            </Link>
          </li>

          <li>
            <Link to="/jobs" data-tooltip="Jobs">
              <span className="icon">🧰</span>
              {open && <span>Jobs</span>}
            </Link>
          </li>

          <li>
            <Link to="/contracts" data-tooltip="Contracts">
              <span className="icon">📄</span>
              {open && <span>Contracts</span>}
            </Link>
          </li>

          <li>
            <Link to="/locations" data-tooltip="Locations">
              <span className="icon">📍</span>
              {open && <span>Locations</span>}
            </Link>
          </li>

          <li>
            <Link to="/customers" data-tooltip="Customers">
              <span className="icon">👥</span>
              {open && <span>Customers</span>}
            </Link>
          </li>

          <li>
            <Link to="/services" data-tooltip="Services">
              <span className="icon">🧪</span>
              {open && <span>Services</span>}
            </Link>
          </li>

          <li>
            <Link to="/activities" data-tooltip="Activities">
              <span className="icon">🐞</span>
              {open && <span>Activities</span>}
            </Link>
          </li>

          <li>
            <Link to="/owner" data-tooltip="Owner">
              <span className="icon">👤</span>
              {open && <span>Owner</span>}
            </Link>
          </li>

        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
