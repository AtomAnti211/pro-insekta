// src/features/services/useServices.ts
import { useEffect, useState } from "react";
import { ServicesAPI } from "../../api/services";
import { type Service } from "../../types/service";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await ServicesAPI.list();
      const data = res.data;

      // rendezés ID szerint
      data.sort((a: Service, b: Service) => a.id - b.id);

      setServices(data);
    } catch (err) {
      setError("Hiba történt a szolgáltatások betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (serviceName: string) => {
    await ServicesAPI.create({ serviceName });
    await load();
  };

  const update = async (id: number, serviceName: string) => {
    await ServicesAPI.update(id, { serviceName });
    await load();
  };

  const remove = async (id: number) => {
    await ServicesAPI.delete(id);
    await load();
  };

  return {
    services,
    loading,
    error,
    create,
    update,
    remove,
  };
}
