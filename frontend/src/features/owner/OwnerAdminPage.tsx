import { useState } from "react";
import { useOwner } from "./useOwner";
import OwnerForm from "./OwnerForm";

export default function OwnerAdminPage() {
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
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage(null);
      setError("Hiba történt a mentés során. A backend nem elérhető.");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div>
      <h1>Owner – Admin</h1>

        {message && <div className="modal success">{message}</div>}
        {error && <div className="modal error">{error}</div>}


      <OwnerForm initial={owner} onSubmit={handleSubmit} />
    </div>
  );
}

