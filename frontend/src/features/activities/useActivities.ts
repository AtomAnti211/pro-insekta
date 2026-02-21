import { useEffect, useState } from "react";
import { activityAdminApi } from "../../api/activityAdmin";
import { MEDIA_URL } from "../../api/core/config";
import type { Activity } from "../../types/activity";

export function useActivities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Betöltés
  const load = async () => {
    try {
      setLoading(true);
      const data = await activityAdminApi.list();

      const fixed = data.map((a: Activity) => {
        let url = a.activityURL;

        // MEDIA_URL hozzáadása, ha kell
        if (url && !url.startsWith("http")) {
          url = MEDIA_URL + url;
        }

        // Cache-busting
        if (url) {
          url = `${url}?ts=${Date.now()}`;
        }

        return {
          ...a,
          activityURL: url,
        };
      });

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

    let url = created.activityURL;
    if (url && !url.startsWith("http")) {
      url = MEDIA_URL + url;
    }
    url = `${url}?ts=${Date.now()}`;

    setItems(prev => [...prev, { ...created, activityURL: url }]);
  };

  // Szerkesztés – A LÉNYEG: lokális frissítés, nem load()
  const updateItem = async (id: number, form: FormData) => {
    const updated = await activityAdminApi.update(id, form);

    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        // Ha a backend üres képet ad vissza → megtartjuk a régit
        let url = updated.activityURL || item.activityURL.replace(/\?ts=.*/, "");

        // MEDIA_URL hozzáadása, ha kell
        if (url && !url.startsWith("http")) {
          url = MEDIA_URL + url;
        }

        // Cache-busting
        url = `${url}?ts=${Date.now()}`;

        return {
          ...item,
          ...updated,
          activityURL: url,
        };
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
