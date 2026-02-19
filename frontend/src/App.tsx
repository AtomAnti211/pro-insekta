import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import NotesPage from "./pages/NotesPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* NYILVÁNOS NYITÓOLDAL */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/activity/:id" element={<ActivityDetailPage />} />

        {/* ADMIN FELÜLET */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="notes" element={<NotesPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
