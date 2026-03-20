import { useEffect, useState } from "react";

export default function DueContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

   // Szerződések lekérése
  useEffect(() => {
    fetch("http://localhost:8000/api/contracts/due-full/?format=json")
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Hiba:", err);
        setLoading(false);
      });
  }, []);

    // Checkbox váltása
  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  // PDF generálás
  async function handleGeneratePdf() {
    if (selected.length === 0) return;

    const response = await fetch("http://localhost:8000/api/contracts/workorder-pdf/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected })
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "munkalap.pdf";
    a.click();
  }

  if (loading) return <p>Betöltés...</p>;

  return (
    <div className="page">
      <h1>Esedékes szerződések (0–12 hónap)</h1>
 <button
        onClick={handleGeneratePdf}
        disabled={selected.length === 0}
        style={{
          marginBottom: "15px",
          padding: "10px 20px",
          background: selected.length === 0 ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: selected.length === 0 ? "not-allowed" : "pointer"
        }}
      >
        PDF munkalap készítése
      </button>


      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ügyfél</th>
            <th>Helyszín</th>
            <th>Szolgáltatás</th>
            <th>Következő esedékesség</th>
            <th>Hónapok hátra</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(c => (
            <tr key={c.contractId}>
                 <td>
                <input
                  type="checkbox"
                  checked={selected.includes(c.contractId)}
                  onChange={() => toggleSelect(c.contractId)}
                />
              </td>

              <td>{c.contractId}</td>
              <td>{c.customerName}</td>
              <td>{c.locationCity} – {c.locationAddress}</td>
              <td>{c.serviceName}</td>
              <td>{c.nextDueDate}</td>
              <td>{c.monthsUntilDue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
