import { useState } from "react";
import { useOwner } from "./useOwner";
import OwnerForm from "./OwnerForm";
import { useNavigate } from "react-router-dom";

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
        navigate("/admin");   // ← ide megy vissza
      }, 2000);

    } catch (err) {
      setMessage(null);
      setError("Hiba történt a mentés során. A backend nem elérhető.");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div>
      <h1>Owner – Admin</h1>

        {message && (
          <div className="modal-overlay">
            <div className="modal-window success">
             <p>{message}</p>
             <button className="modal-btn" onClick={() => setMessage(null)}>OK</button>
            </div>
         </div>
        )}

        {error && (
          <div className="modal-overlay">
           <div className="modal-window error">
           <p>{error}</p>
           <button className="modal-btn" onClick={() => setError(null)}>OK</button>
           </div>
          </div>
        )}
  
      <OwnerForm initial={owner} onSubmit={handleSubmit} />
    </div>
  );
}

