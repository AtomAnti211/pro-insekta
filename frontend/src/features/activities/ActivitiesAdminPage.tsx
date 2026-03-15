import { useState, useRef } from "react";
import { useActivities } from "./useActivities";
import ActivityForm from "./ActivityForm";
import "./ActivitiesAdminPage.css";

function truncate(text: string, max: number = 60) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default function ActivitiesAdminPage() {
  const { items, loading, error, create, update, remove } = useActivities();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const editingItem = items.find(a => a.id === editingId);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const startAdding = () => {
    setEditingId(null);
    setAdding(true);
    scrollToForm();
  };

  const startEditing = (id: number) => {
    setAdding(false);
    setEditingId(id);
    scrollToForm();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Activities – Admin</h1>

      <button className="admin-add-btn" onClick={startAdding}>
        + Új Activity
      </button>

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      <div ref={formRef}>
        {adding && (
          <ActivityForm
            onSubmit={async form => {
              await create(form);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}

        {editingItem && (
          <ActivityForm
            initial={editingItem}
            onSubmit={async form => {
              await update(editingItem.id, form);
              setEditingId(null);   // PANEL BEZÁRÁSA
            }}
            onCancel={() => setEditingId(null)}
          />
        )}
      </div>

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
                  onClick={() => startEditing(a.id)}
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
