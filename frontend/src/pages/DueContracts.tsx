import { useEffect, useState } from "react";
import { getDueFullContracts } from "../services/contractsService";
import type { Contract } from "../services/contractsService";
import "./Duecontracts.css";

export default function DueContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Checkbox váltása
  function toggleSelect(id: number) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  // PDF generálás
  async function handleGeneratePdf() {
    if (selected.length === 0) return;

    setPdfLoading(true);

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

    setPdfLoading(false);

    // Toast
    setToast("A PDF elkészült!");
    setTimeout(() => setToast(null), 3000);
  }

  // Szerződések lekérése
  useEffect(() => {
    getDueFullContracts()
      .then((data: Contract[]) => {
        const sorted = data.sort(
          (a, b) =>
            new Date(a.nextDueDate).getTime() -
            new Date(b.nextDueDate).getTime()
        );
        setContracts(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Betöltés...</p>;

  return (
    <div className="page">

      {toast && <div className="toast">{toast}</div>}

      <h2>Esedékes szerződések (0–12 hónap)</h2>

      <button
        disabled={selected.length === 0 || pdfLoading}
        onClick={handleGeneratePdf}
        className="pdf-button"
      >
        {pdfLoading && <div className="spinner"></div>}
        {pdfLoading ? "PDF készül..." : "PDF munkalap készítése"}
      </button>

      <table className="data-table">
        <thead>
          <tr>
            <th></th>
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