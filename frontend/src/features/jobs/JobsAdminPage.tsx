import { useState } from "react";
import { useJobs } from "./useJobs";
import JobForm from "./JobForm";
import Modal from "../../components/Modal";

export default function JobsAdminPage() {
  const { jobs, loading, error, search, create, update, remove } = useJobs();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const editingItem = jobs.find((j) => j.id === editingId);
  const detailsItem = jobs.find((j) => j.id === detailsId);

  const closeAll = () => {
    setAdding(false);
    setEditingId(null);
    setDetailsId(null);
  };

  return (
    <div className="admin-page">

      {detailsItem && (
        <Modal onClose={closeAll}>
          <div className="details-box">
          <h2>Munka részletei</h2>

          <p><b>ID:</b> {detailsItem.id}</p>
          <p><b>Helyszín:</b> {detailsItem.jobLocationName.locationName}</p>
          <p><b>Szolgáltatás:</b> {detailsItem.jobServiceName.serviceName}</p>
          <p><b>Ügyfél:</b> {detailsItem.jobCustomer.customerName}</p>
          <p><b>Ár:</b> {detailsItem.jobPrice} Ft</p>
          <p><b>Kezdés:</b> {detailsItem.jobStart}</p>
          <p><b>Megjegyzés:</b> {detailsItem.jobRemark}</p>

          {detailsItem.jobURL && (
            <img
              src={detailsItem.jobURL}
              alt="Job"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}
        </div>
      </Modal>
    )}

      <h1 className="admin-title">Munkák – Admin</h1>

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
          + Új munka
        </button>
      </div>

      {(adding || editingItem) && (
        <Modal onClose={closeAll}>
          <JobForm
            initial={editingItem ?? undefined}
            onSubmit={async (form) => {
              if (editingItem) {
                await update(editingItem.id, form);
              } else {
                await create(form);
              }
              closeAll();
            }}
            onCancel={closeAll}
          />
        </Modal>
      )}


      {loading && <p>Betöltés...</p>}
      {error && <p className="error">{error}</p>}

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
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.jobLocationName.locationName}</td>
              <td>{j.jobServiceName.serviceName}</td>
              <td>{j.jobCustomer.customerName}</td>

              <td className="admin-actions">
                <button
                  onClick={() => {
                    closeAll();
                    setDetailsId(j.id);
                  }}
                >
                  Részletek
                </button>

                <button
                  onClick={() => {
                    closeAll();
                    setEditingId(j.id);
                  }}
                >
                  Szerkesztés
                </button>

                <button
                  className="delete-btn"
                  onClick={() => remove(j.id)}
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
