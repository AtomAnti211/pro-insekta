import { useState } from "react";
import { useActivities } from "./useActivities";
import ActivityForm from "./ActivityForm";
import "./ActivitiesAdminPage.css";

// Rövidítő segédfüggvény hosszú leírásokhoz
function truncate(text: string, max: number = 60) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default function ActivitiesAdminPage() {
  const { items, loading, error, create, update, remove } = useActivities();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const editingItem = items.find(a => a.id === editingId);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Activities – Admin</h1>

      <button className="admin-add-btn" onClick={() => setAdding(true)}>
        + Új Activity
      </button>

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      {/* Új activity */}
      {adding && (
        <ActivityForm
          onSubmit={async form => {
            await create(form);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Szerkesztés */}
      {editingItem && (
        <ActivityForm
          initial={editingItem}
          onSubmit={async form => {
            await update(editingItem.id, form);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Kép</th>
            <th>Név</th>
            <th>Leírás</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          {items.map(a => (
            <tr key={a.id}>
              <td>
                {a.activityURL && (
                  <img
                    src={a.activityURL}
                    alt={a.activityName}
                    className="admin-thumb"
                  />
                )}
              </td>

              <td>{a.activityName}</td>

              <td>{truncate(a.activityDescr, 60)}</td>

              <td className="admin-actions">
                <button
                  className="edit-btn"
                  onClick={() => setEditingId(a.id)}
                >
                  Szerkesztés
                </button>

                <button
                  className="delete-btn"
                  onClick={() => remove(a.id)}
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
