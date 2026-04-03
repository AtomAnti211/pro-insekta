import { useState } from "react";
import { useOwner } from "./useOwner";
import OwnerForm from "./OwnerForm";
import { useNavigate } from "react-router-dom";
import "./OwnerForm.css";

export default function OwnerAdminPage() {
  const navigate = useNavigate();
  const { owner, loading, update } = useOwner();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <p>Betöltés...</p>;
  if (!owner) return <p>Nincs owner adat.</p>;

  const handleSubmit = async (form: FormData) => {
    try {
      await update(form);
      setError(null);
      setMessage("Sikeres mentés!");

      setTimeout(() => {
        setMessage(null);
        navigate("/admin");
      }, 2000);

    } catch (err) {
      setMessage(null);
      setError("Hiba történt a mentés során. A backend nem elérhető.");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="owner-page">
      <div className="owner-container">

        {/* A KÁRTYA – a kép is BENNE van */}
        <div className="owner-card">

          {/* FELSŐ KÉP */}
          <img
            className="owner-image"
            src="/images/owner-bg.jpg"
            alt="owner háttér"
          />

          {/* TARTALOM */}
          <div className="owner-card-content">
            <h2 className="owner-title">Owner - Admin</h2>

            {/* SIKER MODAL */}
            {message && (
              <div className="modal-overlay">
                <div className="modal-window success">
                  <p>{message}</p>
                  <button className="modal-btn" onClick={() => setMessage(null)}>OK</button>
                </div>
              </div>
            )}

            {/* HIBA MODAL */}
            {error && (
              <div className="modal-overlay">
                <div className="modal-window error">
                  <p>{error}</p>
                  <button className="modal-btn" onClick={() => setError(null)}>OK</button>
                </div>
              </div>
            )}

            {/* A FORM */}
            <OwnerForm initial={owner} onSubmit={handleSubmit} />
          </div>

        </div>
      </div>
    </div>
  );
}
