import { useEffect, useState } from "react";
import { LocationsAPI } from "../../api/locations";
import type { Location } from "../../types/location";
import type { LocationFormData } from "../../types/locationForm";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filtered, setFiltered] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await LocationsAPI.list();
      const data = res.data;

      data.sort((a: Location, b: Location) => a.id - b.id);

      setLocations(data);
      setFiltered(data);
    } catch (err) {
      setError("Hiba történt a helyszínek betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const search = (text: string) => {
    const t = text.toLowerCase();
    const result = locations.filter((l) =>
      l.locationName.toLowerCase().includes(t)
    );
    setFiltered(result);
  };

  const create = async (form: FormData) => {
    await LocationsAPI.create(form);
    await load();
  };

  const update = async (id: number, form: FormData) => {
    await LocationsAPI.update(id, form);
    await load();
  };


  const remove = async (id: number) => {
    await LocationsAPI.delete(id);
    await load();
  };

  return {
    locations: filtered,
    loading,
    error,
    search,
    create,
    update,
    remove,
    reload: load,
  };
}
