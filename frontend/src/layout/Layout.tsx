import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <nav className={`sidebar ${open ? "expanded" : "collapsed"}`}>
        
        <button 
          className="sidebar-toggle"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <ul className="sidebar-menu">
          <li>
            <Link to="/">
              <span className="icon">🏠</span>
              {open && <span>Home</span>}
            </Link>
          </li>

          <li>
            <Link to="/activities">
              <span className="icon">🐞</span>
              {open && <span>Activities</span>}
            </Link>
          </li>

          <li>
            <Link to="/notes">
              <span className="icon">📝</span>
              {open && <span>Notes</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
