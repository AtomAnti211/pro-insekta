import { useState, useEffect } from "react";
import type { Contract } from "../../types/contract";
import { LocationsAPI } from "../../api/locations";
import { ServicesAPI } from "../../api/services";
import { CustomersAPI } from "../../api/customers";
import "./ContractForm.css";

export default function ContractForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Contract;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [locations, setLocations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [locationId, setLocationId] = useState<number | null>(
    initial?.contractLocationName?.id ?? null
  );
  const [serviceId, setServiceId] = useState<number | null>(
    initial?.contractServiceName?.id ?? null
  );
  const [customerId, setCustomerId] = useState<number | null>(
    initial?.contractCustomerName?.id ?? null
  );

  const [price, setPrice] = useState(initial?.contractPrice ?? 0);
  const [start, setStart] = useState(initial?.contractStart ?? "");
  const [valid, setValid] = useState(initial?.contractValid ?? true);
  const [freq, setFreq] = useState(initial?.contractFrequencyMonth ?? 3);

  useEffect(() => {
    const load = async () => {
      const loc = await LocationsAPI.list();
      const srv = await ServicesAPI.list();
      const cus = await CustomersAPI.list();

      setLocations(loc.data);
      setServices(srv.data);
      setCustomers(cus.data);
    };
    load();
  }, []);

  // AUTOMATIKUS CUSTOMER KITÖLTÉS LOCATION ALAPJÁN
  useEffect(() => {
    if (!locationId) return;

    const loc = locations.find((l) => l.id === locationId);
    if (loc) {
      setCustomerId(loc.locationCustomer?.id ?? null);
    }
  }, [locationId, locations]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // FRONTEND VALIDÁCIÓ
    if (!locationId) {
      alert("Helyszín kiválasztása kötelező!");
      return;
    }

    if (!serviceId) {
      alert("Szolgáltatás kiválasztása kötelező!");
      return;
    }

    if (!customerId) {
      alert("A helyszínhez nem tartozik ügyfél!");
      return;
    }

    onSubmit({
      contractLocationName: locationId,
      contractServiceName:  serviceId,
      contractCustomerName: customerId,
      contractPrice: price,
      contractStart: start,
      contractValid: valid,
      contractFrequencyMonth: freq,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">

      {/* HELYSZÍN */}
      <div className="form-field">
        <label>Helyszín *</label>
        <select
          value={locationId ?? ""}
          onChange={(e) => setLocationId(Number(e.target.value))}
        >
          <option value="">Válassz helyszínt...</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.locationName}
            </option>
          ))}
        </select>
      </div>
      
      <br></br>

      {/* ÜGYFÉL (AUTOMATIKUS) */}
      <div className="form-field">
        <label>Ügyfél (automatikus)</label>
        <input
          value={
            customers.find((c) => c.id === customerId)?.customerName || ""
          }
          readOnly
        />
      </div>

      {/* SZOLGÁLTATÁS */}
      <div className="form-field">
        <label>Szolgáltatás *</label>
        <select
          value={serviceId ?? ""}
          onChange={(e) => setServiceId(Number(e.target.value))}
        >
          <option value="">Válassz szolgáltatást...</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.serviceName}
            </option>
          ))}
        </select>
      </div>

      {/* ÁR */}
      <div className="form-field">
        <label>Ár</label>
        <input
          type="number"
          placeholder="Ár"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {/* KEZDŐ DÁTUM */}
      <div className="form-field">
        <label>Kezdő dátum</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      {/* ÉRVÉNYES */}
      <div className="checkbox-row">
        <span>Érvényes</span>
        <input
          type="checkbox"
          checked={valid}
          onChange={(e) => setValid(e.target.checked)}
        />
      </div>
      <br></br>

      {/* GYAKORISÁG */}
      <div className="form-field">
        <label>Gyakoriság (hónap)</label>
        <input
          type="number"
          placeholder="Gyakoriság (hónap)"
          value={freq}
          onChange={(e) => setFreq(Number(e.target.value))}
        />
      </div>

      {/* GOMBOK */}
      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>
          Mégse
        </button>
      </div>
    </form>
  );
}
