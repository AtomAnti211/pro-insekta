import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";
/*  globals.css */
import '../styles/globals.css';  


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

          {/* Landing page */}
          <li>
            <Link to="/" data-tooltip="Landing Page">
              <span className="icon">🏡</span>
              {open && <span>Landing</span>}
            </Link>
          </li>

          {/* Dashboard */}
          <li>
            <Link to="/admin/dashboard" data-tooltip="Dashboard">
              <span className="icon">📊</span>
              {open && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/notes" data-tooltip="Notes">
              <span className="icon">📝</span>
              {open && <span>Notes</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/jobs" data-tooltip="Jobs">
              <span className="icon">🧰</span>
              {open && <span>Jobs</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/toDo" data-tooltip="ToDo">
              <span className="icon">📅</span>
              {open && <span>ToDo</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/contracts" data-tooltip="Contracts">
              <span className="icon">📄</span>
              {open && <span>Contracts</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/locations" data-tooltip="Locations">
              <span className="icon">📍</span>
              {open && <span>Locations</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/customers" data-tooltip="Customers">
              <span className="icon">👥</span>
              {open && <span>Customers</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/services" data-tooltip="Services">
              <span className="icon">🧪</span>
              {open && <span>Services</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/activities" data-tooltip="Activities">
              <span className="icon">🐞</span>
              {open && <span>Activities</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/owner" data-tooltip="Owner">
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
