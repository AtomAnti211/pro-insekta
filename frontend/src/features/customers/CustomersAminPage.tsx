import { useState } from "react";
import { useCustomers } from "./useCustomers";
import CustomerForm from "./CustomerForm";

export default function CustomersAdminPage() {
  const { customers, loading, error, search, create, update, remove } = useCustomers();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const editingItem = customers.find(c => c.id === editingId);

  return (
    <div className="admin-page">

      {editingItem && (
        <div className="details-box">
          <h2>Részletek</h2>
          <p><b>ID:</b> {editingItem.id}</p>
          <p><b>Név:</b> {editingItem.customerName}</p>
          <p><b>Adószám:</b> {editingItem.customerVat}</p>
          <p><b>Irányítószám:</b> {editingItem.customerPostCode}</p>
          <p><b>Város:</b> {editingItem.customerCity}</p>
          <p><b>Cím:</b> {editingItem.customerAddress}</p>
          <p><b>Email:</b> {editingItem.customerMail}</p>

          <button onClick={() => setEditingId(null)}>Bezárás</button>
        </div>
      )}

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

      {/* ÚJ ÜGYFÉL FORM */}
      {adding && (
        <CustomerForm
          onSubmit={async (data) => {
            await create(data);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

      {/* EGYSZERŰ TÁBLÁZAT */}
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
                <button onClick={() => setEditingId(c.id)}>Részletek</button>
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
