import { useState } from "react";
import { type Customer } from "../../types/customer";

export default function CustomerForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Customer;
  onSubmit: (data: Omit<Customer, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    customerName: initial?.customerName || "",
    customerVat: initial?.customerVat || "",
    customerPostCode: initial?.customerPostCode || 4000,
    customerCity: initial?.customerCity || "",
    customerAddress: initial?.customerAddress || "",
    customerMail: initial?.customerMail || "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input name="customerName" placeholder="Név" value={form.customerName} onChange={handleChange} />
      <input name="customerVat" placeholder="Adószám" value={form.customerVat} onChange={handleChange} />
      <input name="customerPostCode" placeholder="Irányítószám" value={form.customerPostCode} onChange={handleChange} />
      <input name="customerCity" placeholder="Város" value={form.customerCity} onChange={handleChange} />
      <input name="customerAddress" placeholder="Cím" value={form.customerAddress} onChange={handleChange} />
      <input name="customerMail" placeholder="Email" value={form.customerMail} onChange={handleChange} />

      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>Mégse</button>
      </div>
    </form>
  );
}
