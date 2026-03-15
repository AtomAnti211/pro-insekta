import { useEffect, useState } from "react";
import { activityAdminApi } from "../../api/activityAdmin";
import { MEDIA_URL } from "../../api/core/config";
import type { Activity } from "../../types/activity";

// Segédfüggvény: 4 kép URL normalizálása
function fixImageUrls(a: Activity): Activity {
  const fix = (url: string | null | undefined) => {
    if (!url) return "";
    let final = url;

    if (!final.startsWith("http")) {
      final = MEDIA_URL + final;
    }

    return `${final}?ts=${Date.now()}`;
  };

  return {
    ...a,
    activityURL: fix(a.activityURL),
    activityURL1: fix(a.activityURL1),
    activityURL2: fix(a.activityURL2),
    activityURL3: fix(a.activityURL3),
  };
}

export function useActivities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await activityAdminApi.list();
      const fixed = data.map((a: Activity) => fixImageUrls(a));
      setItems(fixed);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Létrehozás
  const createItem = async (form: FormData) => {
    const created = await activityAdminApi.create(form);
    const fixed = fixImageUrls(created);
    setItems(prev => [...prev, fixed]);
  };

  // Szerkesztés
  const updateItem = async (id: number, form: FormData) => {
    const updated = await activityAdminApi.update(id, form);

    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const merged: Activity = {
          ...item,
          ...updated,
          activityURL: updated.activityURL || item.activityURL,
          activityURL1: updated.activityURL1 || item.activityURL1,
          activityURL2: updated.activityURL2 || item.activityURL2,
          activityURL3: updated.activityURL3 || item.activityURL3,
        };

        return fixImageUrls(merged);
      })
    );
  };

  // Törlés
  const removeItem = async (id: number) => {
    await activityAdminApi.remove(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    items,
    loading,
    error,
    create: createItem,
    update: updateItem,
    remove: removeItem,
  };
}
