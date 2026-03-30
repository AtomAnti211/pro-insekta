import { useState } from "react";
import { useNotes } from "./useNotes";
import NoteForm from "./NoteForm";
import "./NotesAdminPage.css";
import Modal from "../../components/Modal";

function statusLabel(status: string) {
  switch (status) {
    case "new":
      return "Új";
    case "in_progress":
      return "Folyamatban";
    case "done":
      return "Kész";
    default:
      return status;
  }
}

export default function NotesAdminPage() {
  const {
    filtered,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    create,
    update,
    remove,
    setStatus,
  } = useNotes();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  const editingItem = filtered.find(n => n.id === editingId);
  const detailItem = filtered.find(n => n.id === detailId);

  const handleCreate = async (data: any) => {
    await create(data);
    setAdding(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    await update(editingItem.id, data);
    setEditingId(null);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Notes – Admin</h1>

      <div className="notes-filters">
        <input
          placeholder="Keresés név / email / telefon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Összes státusz</option>
          <option value="new">Új</option>
          <option value="in_progress">Folyamatban</option>
          <option value="done">Kész</option>
        </select>

        <button
          className="admin-add-btn"
          onClick={() => {
            setEditingId(null);
            setAdding(true);
          }}
        >
          + Új jegyzet
        </button>
      </div>

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      {adding && (
        <Modal onClose={() => setAdding(false)}>
          <NoteForm
            onSubmit={handleCreate}
            onCancel={() => setAdding(false)}
          />
        </Modal>
      )}

      {editingItem && (
        <Modal onClose={() => setEditingId(null)}>
          <NoteForm
            initial={editingItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        </Modal>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Státusz</th>
            <th>Név</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Létrehozva</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(n => (
            <tr key={n.id}>
              <td>
                <span className={`status-badge status-${n.status}`}>
                  {statusLabel(n.status)}
                </span>
              </td>
              <td>{n.noteName}</td>
              <td>{n.noteEmail}</td>
              <td>{n.notePhone}</td>
              <td>{new Date(n.noteCreated).toLocaleString()}</td>
              <td className="admin-actions">
                <button onClick={() => setDetailId(n.id)}>
                  Részletek
                </button>

                <button onClick={() => setEditingId(n.id)}>
                  Szerkesztés
                </button>

                {n.status !== "done" && (
                  <button
                    onClick={() =>
                      setStatus(
                        n,
                        n.status === "new" ? "in_progress" : "done"
                      )
                    }
                  >
                    {n.status === "new" ? "Folyamatban" : "Kész"}
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => remove(n.id)}
                >
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detailItem && (
        <Modal onClose={() => setDetailId(null)}>
          <div className="note-details">
            <h2>{detailItem.noteName}</h2>

            <p><strong>Email:</strong> {detailItem.noteEmail}</p>
            <p><strong>Telefon:</strong> {detailItem.notePhone}</p>
            <p><strong>Cím:</strong> {detailItem.noteAddress}</p>

            <p><strong>Üzenet:</strong></p>
            <p>{detailItem.noteMessage}</p>
            <p><strong>Státusz:</strong> 
              <span className={`status-badge status-${detailItem.status}`}>
              {statusLabel(detailItem.status)}
              </span>
            </p>
  

         
          </div>
        </Modal>
      )}
    </div>
  );
}
