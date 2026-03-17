import { useState } from "react";
import { useServices } from "./useServices";
import ServiceForm from "./ServiceForm";
import "./ServicesAdminPage.css";

export default function ServicesAdminPage() {
  const { services, loading, error, create, update, remove } = useServices();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const editingItem = services.find(s => s.id === editingId);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Szolgáltatások – Admin</h1>

      <div className="notes-filters">
        <div></div>

        <button
          className="admin-add-btn"
          onClick={() => {
            setEditingId(null);
            setAdding(true);
          }}
        >
          + Új szolgáltatás
        </button>
      </div>

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      {adding && (
        <ServiceForm
          onSubmit={async (name: string) => {
            await create(name);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {editingItem && (
        <ServiceForm
          initial={editingItem}
          onSubmit={async (name: string) => {
            await update(editingItem.id, name);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Szolgáltatás neve</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.serviceName}</td>
              <td className="admin-actions">
                <button onClick={() => setEditingId(s.id)}>Szerkesztés</button>
                <button className="delete-btn" onClick={() => remove(s.id)}>
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
