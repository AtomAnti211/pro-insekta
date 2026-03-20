import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import ActivitiesPage from "./features/activities/ActivitiesAdminPage";
import OwnerAdminPage from "./features/owner/OwnerAdminPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";   
import NotesAdminPage from "./features/notes/NotesAdminPage";
import ServicesAdminPage from "./features/services/ServicesAdminPage";
import CustomersAdminPage from "./features/customers/CustomersAminPage";
import DueContracts from "./pages/DueContracts";



export default function App() {
  return (
    <Router>
      <Routes>

        {/* Publikus kezdőoldal */}
        <Route path="/" element={<LandingPage />} />
 
        {/* Publikus aktivitás részletező */}
        <Route path="activities/:id" element={<ActivityDetailPage />} />   

        {/* Layout mindig látszik */}
        <Route path="/" element={<Layout />}>
          {/* /admin automatikusan dashboardra visz */}
          <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/notes" element={<NotesAdminPage />} />
          <Route path="admin/activities" element={<ActivitiesPage />} />
          <Route path="admin/owner" element={<OwnerAdminPage />} />
          <Route path="admin/services" element={<ServicesAdminPage />} />
          <Route path="admin/customers" element={<CustomersAdminPage />} />
          <Route path="/admin/due-contracts" element={<DueContracts />} />

        </Route>

      </Routes>
    </Router>
  );
}