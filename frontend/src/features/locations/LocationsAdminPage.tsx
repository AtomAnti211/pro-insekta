// features/locations/LocationsAdminPage.tsx
import { useState } from "react";
import { useLocations } from "./useLocations";
import LocationForm from "./LocationForm";

export default function LocationsAdminPage() {
  const { locations, loading, error, search, create, update, remove } = useLocations();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const editingItem = locations.find((l) => l.id === editingId);
  const detailsItem = locations.find((l) => l.id === detailsId);

  const closeAll = () => {
    setAdding(false);
    setEditingId(null);
    setDetailsId(null);
  };

  return (
    <div className="admin-page">

      {/* RÉSZLETEK DOBOZ */}
      {detailsItem && (
        <div className="details-box">
          <h2>Részletek</h2>
          <p><b>ID:</b> {detailsItem.id}</p>
          <p><b>Név:</b> {detailsItem.locationName}</p>
          <p><b>Ügyfél:</b> {detailsItem.locationCustomer?.customerName}</p>
          <p><b>Irányítószám:</b> {detailsItem.locationPostCode}</p>
          <p><b>Város:</b> {detailsItem.locationCity}</p>
          <p><b>Cím:</b> {detailsItem.locationAddress}</p>
          <p><b>Email:</b> {detailsItem.locationMail}</p>
          <p><b>Kép:</b> {detailsItem.locationtyURL}</p>

          <button onClick={closeAll}>Bezárás</button>
        </div>
      )}

      <h1 className="admin-title">Helyszínek – Admin</h1>

      {/* KERESŐ + ÚJ GOMB */}
      <div className="notes-filters">
        <input
          className="search-input"
          placeholder="Keresés név alapján..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            search(e.target.value);
          }}
        />

        <button
          className="admin-add-btn"
          onClick={() => {
            closeAll();
            setAdding(true);
          }}
        >
          + Új helyszín
        </button>
      </div>

      {/* ÚJ / SZERKESZTÉS FORM */}
      {(adding || editingItem) && (
        <LocationForm
          initial={editingItem ?? undefined}
          onSubmit={async (data) => {
            if (editingItem) {
              await update(editingItem.id, data);
            } else {
              await create(data);
            }
            closeAll();
          }}
          onCancel={closeAll}
        />
      )}

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      {/* TÁBLÁZAT */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Ügyfél</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.locationName}</td>
              <td>{l.locationCustomer?.customerName}</td>
              <td className="admin-actions">

                {/* RÉSZLETEK */}
                <button
                  onClick={() => {
                    closeAll();
                    setDetailsId(l.id);
                  }}
                >
                  Részletek
                </button>

                {/* SZERKESZTÉS */}
                <button
                  onClick={() => {
                    closeAll();
                    setEditingId(l.id);
                  }}
                >
                  Szerkesztés
                </button>

                {/* TÖRLÉS */}
                <button
                  className="delete-btn"
                  onClick={() => remove(l.id)}
                >
                  Törlés
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
