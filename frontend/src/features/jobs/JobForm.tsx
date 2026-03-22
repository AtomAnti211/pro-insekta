import { useState, useEffect } from "react";
import type { Job } from "../../types/job";
import { ContractsAPI } from "../../api/contracts";

export default function JobForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Job;
  onSubmit: (form: FormData) => void;
  onCancel: () => void;
}) {
  const [contracts, setContracts] = useState<any[]>([]);

  const [contractId, setContractId] = useState<number | null>(
    initial?.jobContractName?.id ?? null
  );

  const [locationName, setLocationName] = useState(
    initial?.jobLocationName?.locationName || ""
  );
  const [serviceName, setServiceName] = useState(
    initial?.jobServiceName?.serviceName || ""
  );
  const [customerName, setCustomerName] = useState(
    initial?.jobCustomer?.customerName || ""
  );

  const [price, setPrice] = useState(initial?.jobPrice ?? 0);
  const [start, setStart] = useState(initial?.jobStart ?? "");
  const [remark, setRemark] = useState(initial?.jobRemark ?? "");

  const [preview, setPreview] = useState<string | null>(
    initial?.jobURL || null
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await ContractsAPI.list();
      setContracts(res.data);
    };
    load();
  }, []);

  // AUTOMATIKUS MEZŐKITÖLTÉS CONTRACT ALAPJÁN
  useEffect(() => {
    if (!contractId) return;

    const c = contracts.find((x) => x.id === contractId);
    if (!c) return;

    setLocationName(c.contractLocationName.locationName);
    setServiceName(c.contractServiceName.serviceName);
    setCustomerName(c.contractCustomerName.customerName);
    setPrice(c.contractPrice);
  }, [contractId, contracts]);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const form = new FormData();
    form.append("jobContractName", String(contractId));
    form.append("jobPrice", String(price));
    form.append("jobStart", start);
    form.append("jobRemark", remark);

    if (file) form.append("jobURL", file);

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">

      <select
        value={contractId ?? ""}
        onChange={(e) => setContractId(Number(e.target.value))}
      >
        <option value="">Válassz szerződést...</option>
        {contracts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.contractLocationName.locationName} – {c.contractServiceName.serviceName}
          </option>
        ))}
      </select>

      <input value={locationName} readOnly />
      <input value={serviceName} readOnly />
      <input value={customerName} readOnly />

      <input
        type="number"
        placeholder="Ár"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <textarea
        placeholder="Megjegyzés"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />

      <div className="upload-card">
        <p>Kép feltöltése</p>

        {preview ? (
          <img src={preview} className="upload-preview" />
        ) : (
          <div className="upload-placeholder">Nincs kép</div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>

      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>
          Mégse
        </button>
      </div>
    </form>
  );
}
