import { useState, useEffect } from "react";
import type { Location } from "../../types/location";
import type { Customer } from "../../types/customer";
import { CustomersAPI } from "../../api/customers";
import { Map, Marker } from "pigeon-maps";


export default function LocationForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Location;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [lat, setLat] = useState(initial?.locationLat ?? 47.53);
  const [lng, setLng] = useState(initial?.locationLng ?? 21.63);

  const [name, setName] = useState(initial?.locationName || "");
  const [customer, setCustomer] = useState<number | null>(
    initial?.locationCustomer?.id ?? null
  );
  const [postCode, setPostCode] = useState(initial?.locationPostCode || 4000);
  const [city, setCity] = useState(initial?.locationCity || "");
  const [address, setAddress] = useState(initial?.locationAddress || "");
  const [mail, setMail] = useState(initial?.locationMail || "");

  const [imagePreview, setImagePreview] = useState<string | null>(
    initial?.locationURL || null
  );
  const [file, setFile] = useState<File | null>(null);
 
  useEffect(() => {
    const loadCustomers = async () => {
      const res = await CustomersAPI.list();
      setCustomers(res.data);
    };
    loadCustomers();
  }, []);

  const handleFileChange = (f: File | null) => {
    setFile(f);

    if (!f) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("locationName", name);
    form.append("locationPostCode", String(postCode));
    form.append("locationCity", city);
    form.append("locationAddress", address);
    form.append("locationMail", mail);

    if (customer) form.append("locationCustomer", String(customer));
    if (file) form.append("locationURL", file);

    form.append("locationLat", String(lat));
    form.append("locationLng", String(lng));

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">

      <input
        placeholder="Helyszín neve"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        value={customer ?? ""}
        onChange={(e) =>
          setCustomer(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">Válassz ügyfelet...</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.customerName}
          </option>
        ))}
      </select>

      <input
        placeholder="Irányítószám"
        value={postCode}
        onChange={(e) => setPostCode(Number(e.target.value))}
      />

      <input
        placeholder="Város"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        placeholder="Cím"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />

      {/* KÉPFELTÖLTÉS */}
      <div className="upload-card">
        <p>Kép feltöltése</p>

        {imagePreview ? (
          <img src={imagePreview} className="upload-preview" />
        ) : (
          <div className="upload-placeholder">Nincs kép</div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>

      {/* KOORDINÁTÁK */}

      <input
        type="number"
        value={lat}
        onChange={(e) => setLat(parseFloat(e.target.value))}
      />

      <input
        type="number"
        value={lng}
        onChange={(e) => setLng(parseFloat(e.target.value))}
      />

      <div style={{ marginTop: "20px" }}>
        <Map
          height={300}
          center={[lat, lng]}
          defaultZoom={13}
          onClick={({ latLng }) => {
            setLat(latLng[0]);
            setLng(latLng[1]);
          }}
        >

          <Marker width={40} anchor={[lat, lng]} />
        </Map>

        <div style={{ marginTop: "10px" }}>
          <label>Szélesség (lat):</label>
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
          />

          <label>Hosszúság (lng):</label>
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value))}
          />
        </div>
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