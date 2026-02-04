import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <nav style={{
        width: 220,
        background: "#222",
        color: "white",
        padding: 20
      }}>
        <h2>Insecta Admin</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/" style={{ color: "white" }}>Home</Link></li>
          <li><Link to="/activities" style={{ color: "white" }}>Activities</Link></li>
          <li><Link to="/notes" style={{ color: "white" }}>Notes</Link></li>
        </ul>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
