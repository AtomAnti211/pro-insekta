// ownerForm.tsx
import { useState } from "react";
import type { Owner } from "../../types/owner";
import "./OwnerForm.css";

interface Props {
  initial: Owner;
  onSubmit: (form: FormData) => void;
}

export default function OwnerForm({ initial, onSubmit }: Props) {
  const [formState, setFormState] = useState(initial);

  const handleChange = (key: keyof Owner, value: string | number) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    onSubmit(form);
  };

  return (
   <form onSubmit={handleSubmit} className="admin-form">

  <div className="form-row">
    <div className="form-field">
      <label>Név</label>
      <input
        value={formState.ownerName}
        onChange={e => handleChange("ownerName", e.target.value)}
      />
    </div>

    <div className="form-field">
      <label>Adószám</label>
      <input
        value={formState.ownerVat}
        onChange={e => handleChange("ownerVat", e.target.value)}
      />
    </div>
  </div>

  <div className="form-row">
    <div className="form-field">
      <label>Cím</label>
      <input
        value={formState.ownerAddress}
        onChange={e => handleChange("ownerAddress", e.target.value)}
      />
    </div>

    <div className="form-field">
      <label>Irányítószám</label>
      <input
        type="number"
        value={formState.ownerPostCode}
        onChange={e => handleChange("ownerPostCode", Number(e.target.value))}
      />
    </div>
  </div>

  <div className="form-row">
    <div className="form-field">
      <label>Munkavállaló</label>
      <input
        value={formState.ownerWorker}
        onChange={e => handleChange("ownerWorker", e.target.value)}
      />
    </div>

    <div className="form-field">
      <label>Engedély</label>
      <input
        value={formState.ownerPermission}
        onChange={e => handleChange("ownerPermission", e.target.value)}
      />
    </div>
  </div>

  <div className="form-row">
    <div className="form-field">
      <label>Telefon</label>
      <input
        value={formState.ownerPhone}
        onChange={e => handleChange("ownerPhone", e.target.value)}
      />
    </div>

    <div className="form-field">
      <label>Email</label>
      <input
        value={formState.ownerMail}
        onChange={e => handleChange("ownerMail", e.target.value)}
      />
    </div>
  </div>

  <button type="submit" className="save-btn">Mentés</button>
</form>
  );
}
