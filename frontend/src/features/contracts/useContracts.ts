import { useEffect, useState } from "react";
import { ContractsAPI } from "../../api/contracts";
import type { Contract } from "../../types/contract";

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filtered, setFiltered] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await ContractsAPI.list();
      const data = res.data;

      data.sort((a: Contract, b: Contract) => a.id - b.id);

      setContracts(data);
      setFiltered(data);
    } catch (err) {
      setError("Hiba történt a szerződések betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const search = (text: string) => {
    const t = text.toLowerCase();
    const result = contracts.filter((c) =>
      c.contractLocationName.locationName.toLowerCase().includes(t)
    );
    setFiltered(result);
  };

  const create = async (data: any) => {
    await ContractsAPI.create(data);
    await load();
  };

  const update = async (id: number, data: any) => {
    await ContractsAPI.update(id, data);
    await load();
  };

  const remove = async (id: number) => {
    await ContractsAPI.delete(id);
    await load();
  };

  return {
    contracts: filtered,
    loading,
    error,
    search,
    create,
    update,
    remove,
    reload: load,
  };
}
