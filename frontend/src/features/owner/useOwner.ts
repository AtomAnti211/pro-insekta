import { useEffect, useState } from "react";
import { ownerAdminApi } from "../../api/ownerAdmin";
import type { Owner } from "../../types/owner";

export function useOwner() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await ownerAdminApi.get();
    setOwner(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (form: FormData) => {
    const updated = await ownerAdminApi.update(form);
    setOwner(updated);
  };

  return { owner, loading, update };
}
