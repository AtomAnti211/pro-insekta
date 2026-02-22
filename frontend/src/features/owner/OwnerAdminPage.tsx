import { useOwner } from "./useOwner";
import OwnerForm from "./OwnerForm";

export default function OwnerAdminPage() {
  const { owner, loading, update } = useOwner();

  if (loading) return <p>Betöltés...</p>;
  if (!owner) return <p>Nincs owner adat.</p>;

  return (
    <div>
      <h1>Owner – Admin</h1>

      <OwnerForm
        initial={owner}
        onSubmit={async form => {
          await update(form);
        }}
      />
    </div>
  );
}

