import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/NotesPage";
import Activities from "./pages/ActivitiesPage";
import LandingPage from "./pages/LandingPage";
import ActivitiesPage from "./features/activities/ActivitiesAdminPage";
import OwnerAdminPage from "./features/owner/OwnerAdminPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";   

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Publikus kezdőoldal */}
        <Route path="/" element={<LandingPage />} />

        {/* Publikus aktivitás lista */}
        <Route path="activities" element={<Activities />} />

        {/* Publikus aktivitás részletező */}
        <Route path="activities/:id" element={<ActivityDetailPage />} />   

        {/* Layout mindig látszik */}
        <Route path="/" element={<Layout />}>
          {/* /admin automatikusan dashboardra visz */}
          <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/notes" element={<Notes />} />
          <Route path="admin/activities" element={<ActivitiesPage />} />
          <Route path="admin/owner" element={<OwnerAdminPage />} />
        </Route>

      </Routes>
    </Router>
  );
}