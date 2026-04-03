import { useEffect, useState } from "react";
import { JobsAPI } from "../../api/jobs";
import type { Job } from "../../types/job";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortJobs = (list: Job[]) =>
    [...list].sort((a, b) => {
      const locA = a.jobLocationName.locationName;
      const locB = b.jobLocationName.locationName;

      const byLocation = locA.localeCompare(locB, "hu", {
        sensitivity: "base",
        ignorePunctuation: true,
      });

      if (byLocation !== 0) return byLocation;

      return b.jobStart.localeCompare(a.jobStart);
   });


  const load = async () => {
    try {
      setLoading(true);
      const res = await JobsAPI.list();
      const data = res.data;

      const sorted = sortJobs(data);

      setJobs(sorted);
      setFiltered(sorted);
    } catch (err) {
      setError("Hiba történt a munkák betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

const search = (text: string, year: string = "") => {
  const t = text.toLowerCase();

  const result = jobs
    .filter((j) => {
      const matchesText =
        j.jobLocationName.locationName.toLowerCase().includes(t);

      const matchesYear =
        year === "" || j.jobStart.startsWith(year);

      return matchesText && matchesYear;
    })
    .sort((a, b) => {
    const locA = a.jobLocationName.locationName;
    const locB = b.jobLocationName.locationName;

    const byLocation = locA.localeCompare(locB, "hu", {
      sensitivity: "base",
      ignorePunctuation: true,
    });

    if (byLocation !== 0) return byLocation;

    return a.jobStart.localeCompare(b.jobStart);
  });

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
