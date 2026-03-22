import { useEffect, useState } from "react";
import { JobsAPI } from "../../api/jobs";
import type { Job } from "../../types/job";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await JobsAPI.list();
      const data = res.data;

      data.sort((a: Job, b: Job) => a.id - b.id);

      setJobs(data);
      setFiltered(data);
    } catch (err) {
      setError("Hiba történt a munkák betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const search = (text: string) => {
    const t = text.toLowerCase();
    const result = jobs.filter((j) =>
      j.jobLocationName.locationName.toLowerCase().includes(t)
    );
    setFiltered(result);
  };

  const create = async (form: FormData) => {
    await JobsAPI.create(form);
    await load();
  };

  const update = async (id: number, form: FormData) => {
    await JobsAPI.update(id, form);
    await load();
  };

  const remove = async (id: number) => {
    await JobsAPI.delete(id);
    await load();
  };

  return {
    jobs: filtered,
    loading,
    error,
    search,
    create,
    update,
    remove,
    reload: load,
  };
}
