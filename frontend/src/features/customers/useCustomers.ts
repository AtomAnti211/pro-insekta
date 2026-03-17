import { useEffect, useState } from "react";
import { CustomersAPI } from "../../api/customers";
import { type Customer } from "../../types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await CustomersAPI.list();
      const data = res.data;

      data.sort((a: Customer, b: Customer) => a.id - b.id);

      setCustomers(data);
      setFiltered(data);
    } catch (err) {
      setError("Hiba történt az ügyfelek betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const search = (text: string) => {
    const t = text.toLowerCase();
    const result = customers.filter(c =>
      c.customerName.toLowerCase().includes(t)
    );
    setFiltered(result);
  };

  const create = async (customer: Omit<Customer, "id">) => {
    await CustomersAPI.create(customer);
    await load();
  };

  const update = async (id: number, customer: Omit<Customer, "id">) => {
    await CustomersAPI.update(id, customer);
    await load();
  };

  const remove = async (id: number) => {
    await CustomersAPI.delete(id);
    await load();
  };

  return {
    customers: filtered,
    loading,
    error,
    search,
    create,
    update,
    remove,
    reload: load,
  };
}
