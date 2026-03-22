// features/contracts/ContractsAdminPage.tsx
import { useState } from "react";
import { useContracts } from "./useContracts";
import ContractForm from "./ContractForm";

export default function ContractsAdminPage() {
  const { contracts, loading, error, search, create, update, remove } =
    useContracts();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const editingItem = contracts.find((c) => c.id === editingId);
  const detailsItem = contracts.find((c) => c.id === detailsId);

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
          <h2>Szerződés részletei</h2>

          <p><b>ID:</b> {detailsItem.id}</p>
          <p><b>Helyszín:</b> {detailsItem.contractLocationName?.locationName}</p>
          <p><b>Szolgáltatás:</b> {detailsItem.contractServiceName?.serviceName}</p>
          <p><b>Ügyfél:</b> {detailsItem.contractCustomerName?.customerName}</p>
          <p><b>Ár:</b> {detailsItem.contractPrice} Ft</p>
          <p><b>Kezdés:</b> {detailsItem.contractStart}</p>
          <p><b>Érvényes:</b> {detailsItem.contractValid ? "Igen" : "Nem"}</p>
          <p><b>Gyakoriság (hónap):</b> {detailsItem.contractFrequencyMonth}</p>

          <button onClick={closeAll}>Bezárás</button>
        </div>
      )}

      <h1 className="admin-title">Szerződések – Admin</h1>

      {/* KERESŐ + ÚJ GOMB */}
      <div className="notes-filters">
        <input
          className="search-input"
          placeholder="Keresés helyszín alapján..."
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
          + Új szerződés
        </button>
      </div>

      {/* ÚJ / SZERKESZTÉS FORM */}
      {(adding || editingItem) && (
        <ContractForm
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
            <th>Helyszín</th>
            <th>Szolgáltatás</th>
            <th>Ügyfél</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          {contracts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.contractLocationName?.locationName}</td>
              <td>{c.contractServiceName?.serviceName}</td>
              <td>{c.contractCustomerName?.customerName}</td>

              <td className="admin-actions">

                {/* RÉSZLETEK */}
                <button
                  onClick={() => {
                    closeAll();
                    setDetailsId(c.id);
                  }}
                >
                  Részletek
                </button>

                {/* SZERKESZTÉS */}
                <button
                  onClick={() => {
                    closeAll();
                    setEditingId(c.id);
                  }}
                >
                  Szerkesztés
                </button>

                {/* TÖRLÉS */}
                <button
                  className="delete-btn"
                  onClick={() => remove(c.id)}
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
