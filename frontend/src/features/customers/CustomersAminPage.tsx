import { useState } from "react";
import { useCustomers } from "./useCustomers";
import CustomerForm from "./CustomerForm";
import Modal from "../../components/Modal";

export default function CustomersAdminPage() {
  const { customers, loading, error, search, create, update, remove } = useCustomers();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const editingItem = customers.find(c => c.id === editingId);
  const detailItem = customers.find(c => c.id === detailId);

  return (
    <div className="admin-page">

      <h1 className="admin-title">Ügyfelek – Admin</h1>

      {/* KERESŐ + ÚJ GOMB */}
      <div className="notes-filters">
        <input
          className="search-input"
          placeholder="Keresés név alapján..."
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
            search(e.target.value);
          }}
        />

        <button
          className="admin-add-btn"
          onClick={() => {
            setEditingId(null);
            setAdding(true);
          }}
        >
          + Új ügyfél
        </button>
      </div>

      {/* ÚJ ÜGYFÉL POPUP */}
      {adding && (
        <Modal onClose={() => setAdding(false)}>
          <CustomerForm
            onSubmit={async (data) => {
              await create(data);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </Modal>
      )}

      {/* SZERKESZTÉS POPUP */}
      {editingItem && (
        <Modal onClose={() => setEditingId(null)}>
          <CustomerForm
            initial={editingItem}
            onSubmit={async (data) => {
              await update(editingItem.id, data);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        </Modal>
      )}

      {/* RÉSZLETEK POPUP */}
      {detailItem && (
        <Modal onClose={() => setDetailId(null)}>
          <div className="note-details">
            <h2>{detailItem.customerName}</h2>

            <p><strong>ID:</strong> {detailItem.id}</p>
            <p><strong>Név:</strong> {detailItem.customerName}</p>
            <p><strong>Email:</strong> {detailItem.customerMail}</p>
            <p><strong>Cím:</strong> {detailItem.customerAddress}</p>

            <button onClick={() => setDetailId(null)}>Bezárás</button>
          </div>
        </Modal>
      )}

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      {/* TÁBLÁZAT */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.customerName}</td>
              <td className="admin-actions">
                <button onClick={() => setDetailId(c.id)}>Részletek</button>
                <button onClick={() => setEditingId(c.id)}>Szerkesztés</button>
                <button className="delete-btn" onClick={() => remove(c.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
