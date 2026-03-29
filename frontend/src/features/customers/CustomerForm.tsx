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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "customerPostCode" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">

      <input
        name="customerName"
        placeholder="Név"
        value={form.customerName}
        onChange={handleChange}
        required
      />

      <input
        name="customerVat"
        placeholder="Adószám"
        value={form.customerVat}
        onChange={handleChange}
      />

      <input
        type="number"
        name="customerPostCode"
        placeholder="Irányítószám"
        value={form.customerPostCode}
        onChange={handleChange}
      />

      <input
        name="customerCity"
        placeholder="Város"
        value={form.customerCity}
        onChange={handleChange}
      />

      <input
        name="customerAddress"
        placeholder="Cím"
        value={form.customerAddress}
        onChange={handleChange}
      />

      <input
        type="email"
        name="customerMail"
        placeholder="Email"
        value={form.customerMail}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>Mégse</button>
      </div>
    </form>
  );
}