import { useState } from "react";

export default function ServiceForm({ initial, onSubmit, onCancel }: any) {
  const [serviceName, setServiceName] = useState(initial?.serviceName || "");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(serviceName);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        placeholder="Szolgáltatás neve..."
        value={serviceName}
        onChange={e => setServiceName(e.target.value)}
      />

      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>Mégse</button>
      </div>
    </form>
  );
}
