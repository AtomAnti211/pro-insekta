import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import NotesPage from "./pages/NotesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="notes" element={<NotesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
