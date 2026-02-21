import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Homepage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/NotesPage";
import Activities from "./pages/ActivitiesPage";
import Owner from "./pages/OwnerPage";


export default function App() {
  return (
    <Router>
      <Routes>

        {/* Publikus kezdőoldal */}
        <Route path="/" element={<Homepage />} />

        {/* Admin layout */}
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes" element={<Notes />} />
          
          <Route path="activities" element={<Activities />} />
          <Route path="owner" element={<Owner />} />
        </Route>

      </Routes>
    </Router>
  );
}
