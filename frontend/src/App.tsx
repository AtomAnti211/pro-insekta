import ProtectedRoute from "./components/ProtectedRoute";
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
import LocationsAdminPage from "./features/locations/LocationsAdminPage";
import ContractsAdminPage from "./features/contracts/ContractsAdminPage";
import JobsAdminPage from "./features/jobs/JobsAdminPage";
import Login from "./components/Login";


export default function App() {
  return (
    <Router>
      <Routes>

        {/* Publikus kezdőoldal */}
        <Route path="/" element={<LandingPage />} />

        {/* Publikus aktivitás részletező */}
        <Route path="activities/:id" element={<ActivityDetailPage />} />

        {/* Login oldal */}
        <Route path="/login" element={<Login />} />


        {/* ADMIN RÉSZ – teljesen védett */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes" element={<NotesAdminPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="owner" element={<OwnerAdminPage />} />
          <Route path="services" element={<ServicesAdminPage />} />
          <Route path="customers" element={<CustomersAdminPage />} />
          <Route path="locations" element={<LocationsAdminPage />} />
          <Route path="contracts" element={<ContractsAdminPage />} />
          <Route path="jobs" element={<JobsAdminPage />} />
          <Route path="due-contracts" element={<DueContracts />} />
        </Route>

      </Routes>
    </Router>
  );
}
