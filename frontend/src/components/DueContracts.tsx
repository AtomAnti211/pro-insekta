import { useEffect, useState } from "react";
import { getDueFullContracts } from "../services/contractsService";
import type { Contract } from "../services/contractsService";


export default function DueContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<number[]>([]);

  // Checkbox váltása
  function toggleSelect(id: number) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  // PDF generálás meghívása
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

  // Szerződések lekérése
  useEffect(() => {
    getDueFullContracts()
      .then((data: Contract[]) => {
        setContracts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Hiba:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Betöltés...</p>;

  return (
    <div>
      <h2>Esedékes szerződések (0–12 hónap)</h2>

      <button
        disabled={selected.length === 0}
        onClick={handleGeneratePdf}
      >
        PDF munkalap készítése
      </button>

      <table>
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