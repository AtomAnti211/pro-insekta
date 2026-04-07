import { useEffect, useState } from "react";
import { getDueFullContracts } from "../services/contractsService";
import type { DueContract } from "../types/dueContracts";
import { useMemo } from "react";
import { useCallback } from "react";

import "./Duecontracts.css";

import { Map as PigeonMap, Marker, Overlay } from "pigeon-maps";

type OptionType = { value: string | number; label: string };

export default function DueContracts() {
  const [contracts, setContracts] = useState<DueContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //const [selected, setSelected] = useState<number[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  
  const customerOptions = useMemo(() => {
    return [...new Set(contracts.map(c => c.customerName))]
      .map(name => ({ value: name, label: name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [contracts]);

  const cityOptions = useMemo(() => {
    return [...new Set(contracts.map(c => c.locationCity))]
      .map(city => ({ value: city, label: city }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [contracts]);

  const monthOptions = useMemo(() => {
    return [...Array(13).keys()].map(m => ({
      value: m,
      label: `${m} hónap`
    }));
}, []);


  // --- Dual-listbox state-ek ---
  const [filterCustomers, setFilterCustomers] = useState<OptionType[]>([]);
  const [filterCities, setFilterCities] = useState<OptionType[]>([]);
  const [filterMonths, setFilterMonths] = useState<OptionType[]>([
    { value: 0, label: "0 hónap" },
    { value: 1, label: "1 hónap" }
  ]);
  const addCustomer = useCallback((opt: OptionType) => {
    setFilterCustomers(prev => [...prev, opt]);
  }, []);

  const removeCustomer = useCallback((value: string | number) => {
    setFilterCustomers(prev => prev.filter(x => x.value !== value));
  }, []);

  const addCity = useCallback((opt: OptionType) => {
    setFilterCities(prev => [...prev, opt]);
  }, []);

  const removeCity = useCallback((value: string | number) => {
    setFilterCities(prev => prev.filter(x => x.value !== value));
  }, []);

  const addMonth = useCallback((opt: OptionType) => {
    setFilterMonths(prev => [...prev, opt]);
  }, []);

  const removeMonth = useCallback((value: number) => {
    setFilterMonths(prev => prev.filter(x => x.value !== value));
  }, []);


  const [activeMarker, setActiveMarker] = useState<{
    lat: number;
    lng: number;
    label: string;  
  } | null>(null);

  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  // -----------------------------
  // 1) Checkbox váltása
  // -----------------------------
  function toggleSelect(rowKey: string) {
    setSelected(prev =>
      prev.includes(rowKey)
        ? prev.filter(x => x !== rowKey)
        : [...prev, rowKey]
    );
  }

  function jumpToTable(marker: { lat: number; lng: number; label: string }) {
    // 1) Az adott markerhez tartozó sorok
    const rows = filtered.filter(
      c => c.locationLat === marker.lat && c.locationLng === marker.lng
    );

    if (rows.length === 0) return;

    // 2) Legkorábbi esedékességű sor
    const earliest = rows.reduce((a, b) =>
      new Date(a.nextDueDate).getTime() < new Date(b.nextDueDate).getTime()
        ? a
        : b
    );

    setHighlightRow(earliest.contractId);

    setTimeout(() => {
      const el = document.getElementById(`row-${earliest.contractId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }
  async function handleGeneratePdf() {
    if (selected.length === 0) return;

    // 🔥 A rowKey-kből (pl. "24-0") visszaalakítjuk a contractId-kat (pl. 24)
    const contractIds = Array.from(
      new Set(
        selected.map(key => Number(key.split("-")[0]))
      )
    );

    setPdfLoading(true);

    const response = await fetch("http://localhost:8000/api/contracts/workorder-pdf/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: contractIds })
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

  useEffect(() => {
    getDueFullContracts()
      .then((data: DueContract[]) => {
        const sorted = data.sort(
          (a, b) =>
            new Date(a.nextDueDate).getTime() -
            new Date(b.nextDueDate).getTime()
        );
        setContracts(sorted);
         const allCustomers = [...new Set(sorted.map(c => c.customerName))]
          .map(name => ({ value: name, label: name }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const allCities = [...new Set(sorted.map(c => c.locationCity))]
          .map(city => ({ value: city, label: city }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setFilterCustomers(allCustomers);
        setFilterCities(allCities);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // -----------------------------
  // Szűrés (MEMOIZÁLVA)
  // -----------------------------
  const filtered = useMemo(() => {
    return contracts.filter(c => {
      const matchCustomer =
        filterCustomers.length === 0 ||
        filterCustomers.some(sel => sel.value === c.customerName);

      const matchCity =
        filterCities.length === 0 ||
        filterCities.some(sel => sel.value === c.locationCity);

      const matchMonths =
        filterMonths.length === 0 ||
        filterMonths.some(sel => sel.value === c.monthsUntilDue);

      return matchCustomer && matchCity && matchMonths;
    });
  }, [contracts, filterCustomers, filterCities, filterMonths]);


// -----------------------------
// MapPoints (MEMOIZÁLVA)
// -----------------------------
  const mapPoints = useMemo(() => {
    const unique = new Map<string, {
      id: string;
      lat: number;
      lng: number;
      label: string;
    }>();

    filtered
      .filter(c => c.locationLat && c.locationLng)
      .forEach(c => {
        const key = `${c.locationLat}-${c.locationLng}`;
        if (!unique.has(key)) {
          unique.set(key, {
            id: key,
            lat: c.locationLat!,
            lng: c.locationLng!,
            label: `${c.customerName} – ${c.locationCity}`
          });
        }
      });

    return Array.from(unique.values());
  }, [filtered]);


  // -----------------------------
  // Render
  // -----------------------------
  if (loading) return <p>Betöltés...</p>;

  return (
    <div className="page">

      {toast && <div className="toast">{toast}</div>}

      <h2>Esedékes szerződések (0–12 hónap)</h2>

      <div className="filters">

        <div className="dual-listbox">
          <div className="list selected">
            <label>Kiválasztott vevők</label>
            <ul>
              {filterCustomers.map(item => (
                <li
                  key={item.value}
                  onClick={() => removeCustomer(item.value)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="list available">
            <label>Választható vevők</label>
            <ul>
              {customerOptions
                .filter(opt => !filterCustomers.some(sel => sel.value === opt.value))
                .map(opt => (
                  <li
                    key={opt.value}
                    onClick={() => addCustomer(opt)}
                  >
                    {opt.label}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="dual-listbox">
          <div className="list selected">
            <label>Kiválasztott városok</label>
            <ul>
              {filterCities.map(item => (
                <li
                  key={item.value}
                  onClick={() => removeCity(item.value)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="list available">
            <label>Választható városok</label>
            <ul>
              {cityOptions
                .filter(opt => !filterCities.some(sel => sel.value === opt.value))
                .map(opt => (
                  <li
                    key={opt.value}
                    onClick={() => addCity(opt)}
                  >
                    {opt.label}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="dual-listbox">
          <div className="list selected">
            <label>Kiválasztott hónapok</label>
            <ul>
              {filterMonths.map(item => (
                <li
                  key={item.value}
                  onClick={() => removeMonth(item.value as number)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="list available">
            <label>Választható hónapok</label>
            <ul>
              {monthOptions
                .filter(opt => !filterMonths.some(sel => sel.value === opt.value))
                .map(opt => (
                  <li
                    key={opt.value}
                    onClick={() => addMonth(opt)}
                  >
                    {opt.label}
                  </li>
                ))}
            </ul>
          </div>
        </div>

      </div>

      <div className="filter-buttons">

        <button
          className="btn-clear"
          onClick={() => {
            setFilterCustomers(customerOptions);
            setFilterCities(cityOptions);
            setFilterMonths([
              { value: 0, label: "0 hónap" },
              { value: 1, label: "1 hónap" }
            ]);
          }}
        >
          Szűrők törlése (0–1 hónap)
        </button>

      </div>

      <div style={{ marginTop: "20px" }}>
        <PigeonMap
          height={400} 
          defaultCenter={[47.53, 21.63]} 
          defaultZoom={7}  
          minZoom={6}
          maxZoom={18}>
          {mapPoints.map(p => (
            <Marker
              key={p.id}
              width={40}
              anchor={[p.lat, p.lng]}
              onClick={() => setActiveMarker(p)}
            />
          ))}

          {activeMarker && (
            <Overlay anchor={[activeMarker.lat, activeMarker.lng]}>
              <div className="popup">
                <strong>{activeMarker.label}</strong>

                <div
                  className="jump-icon"
                  onClick={() => jumpToTable(activeMarker)}
                >
              📌 Ugrás a táblázatra
                </div>

                <button
                  className="close-popup"
                  onClick={() => setActiveMarker(null)}
                >
                  Bezárás
                </button>
              </div>
            </Overlay>
          )}
        </PigeonMap>
      </div>

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
            <th>Hátralévő hónap</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => {
            const rowKey = `${c.contractId}-${c.monthsUntilDue}`;

            return (
              <tr
                key={rowKey}
                className={highlightRow === c.contractId ? "highlight" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(rowKey)}
                    onChange={() => toggleSelect(rowKey)}
                  />
                </td>
                <td>{c.contractId}</td>
                <td>{c.customerName}</td>
                <td>{c.locationPostCode} – {c.locationCity} – {c.locationAddress}</td>
                <td>{c.serviceName}</td>
                <td>{c.nextDueDate}</td>
                <td>{c.monthsUntilDue}</td>
              </tr>
            );
          })}
        </tbody> 
      </table>
    </div>
  );
}