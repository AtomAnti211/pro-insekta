import { useEffect, useState } from "react";
import { getDueFullContracts } from "../services/contractsService";
import type { DueContract } from "../types/dueContracts";

import "./Duecontracts.css";

import { Map, Marker } from "pigeon-maps";

export default function DueContracts() {
  const [contracts, setContracts] = useState<DueContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const [filterCustomers, setFilterCustomers] = useState<string[]>([]);
  const [filterCities, setFilterCities] = useState<string[]>([]);
  const [filterMonths, setFilterMonths] = useState<number[]>([]);

  const [mapPoints, setMapPoints] = useState<
    { id: number; lat: number; lng: number; label: string }[]
  >([]);

  // -----------------------------
  // 1) Checkbox váltása
  // -----------------------------
  function toggleSelect(id: number) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  // -----------------------------
  // 2) PDF generálás
  // -----------------------------
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

    setToast("A PDF elkészült!");
    setTimeout(() => setToast(null), 3000);
  }

  // -----------------------------
  // 3) Szerződések lekérése
  // -----------------------------
  useEffect(() => {
    getDueFullContracts()
      .then((data: DueContract[]) => {
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

  // -----------------------------
  // 4) Szűrés
  // -----------------------------
  const filtered = contracts.filter(c => {
    const matchCustomer =
      filterCustomers.length === 0 || filterCustomers.includes(c.customerName);

    const matchCity =
      filterCities.length === 0 || filterCities.includes(c.locationCity);

    const matchMonths =
      filterMonths.length === 0 || filterMonths.includes(c.monthsUntilDue);

    return matchCustomer && matchCity && matchMonths;
  });

  // -----------------------------
  // 5) MapPoints frissítése (BACKEND KOORDINÁTÁKKAL)
  // -----------------------------
  useEffect(() => {
    const points = filtered
      .filter(c => c.locationLat && c.locationLng)
      .map(c => ({
        id: c.contractId,
        lat: c.locationLat!,
        lng: c.locationLng!,
        label: `${c.customerName} – ${c.locationCity}`
      }));

    setMapPoints(points);
  }, [filtered]);

  // -----------------------------
  // 6) Render
  // -----------------------------
  if (loading) return <p>Betöltés...</p>;

  return (
    <div className="page">

      {toast && <div className="toast">{toast}</div>}

      <h2>Esedékes szerződések (0–12 hónap)</h2>

      {/* SZŰRŐK */}
      <div className="filters">
        <select multiple value={filterCustomers} onChange={(e) =>
          setFilterCustomers(Array.from(e.target.selectedOptions, o => o.value))
        }>
          {[...new Set(contracts.map(c => c.customerName))].map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select multiple value={filterCities} onChange={(e) =>
          setFilterCities(Array.from(e.target.selectedOptions, o => o.value))
        }>
          {[...new Set(contracts.map(c => c.locationCity))].map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          multiple
          value={filterMonths.map(String)}
          onChange={(e) =>
            setFilterMonths(Array.from(e.target.selectedOptions, o => Number(o.value)))
          }
        >
          {[...Array(13).keys()].map(m => (
            <option key={m} value={m}>{m} hónap</option>
          ))}
        </select>
      </div>

      {/* PDF GOMB */}
      <button
        disabled={selected.length === 0 || pdfLoading}
        onClick={handleGeneratePdf}
        className="pdf-button"
      >
        {pdfLoading && <div className="spinner"></div>}
        {pdfLoading ? "PDF készül..." : "PDF munkalap készítése"}
      </button>

      {/* TÉRKÉP */}
      <div style={{ marginTop: "20px" }}>
        <Map height={400} defaultCenter={[47.53, 21.63]} defaultZoom={9}>
          {mapPoints.map(p => (
            <Marker
              key={p.id}
              width={40}
              anchor={[p.lat, p.lng]}
              onClick={() => alert(p.label)}
            />
          ))}
        </Map>
      </div>

      {/* TÁBLÁZAT */}
      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Ügyfél</th>
            <th>Helyszín</th>
            <th>Szolgáltatás</th>
            <th>Következő esedékesség</th>
            <th>Hátra lévő hónap</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
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
              <td>{c.locationPostCode} – {c.locationCity} – {c.locationAddress}</td>
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