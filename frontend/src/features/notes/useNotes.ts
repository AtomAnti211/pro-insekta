import { useEffect, useState } from "react";
import { noteApi } from "../../api/note";
import type { Note, NoteStatus } from "../../types/note";

type NoteUpdatePayload = {
  contact_message: string | null;
  noteName: string;
  noteEmail: string | null;
  notePhone: string;
  noteAddress: string;
  noteMessage: string;
  noteActivity: number | null;
  status: NoteStatus;
};

export function useNotes() {
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<NoteStatus | "all">("all");

  const load = async () => {
    try {
      setLoading(true);
      const data = await noteApi.list();
      setItems(data);
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

  const create = async (data: Partial<Note>) => {
    const created = await noteApi.create(data);
    setItems(prev => [created, ...prev]);
  };

  const update = async (id: number, data: Partial<Note>) => {
    const updated = await noteApi.update(id, data);
    setItems(prev => prev.map(n => (n.id === id ? updated : n)));
  };

  const remove = async (id: number) => {
    await noteApi.remove(id);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setStatus = async (note: Note, status: NoteStatus) => {
  const updated = await noteApi.setStatus(note.id, status);
  setItems(prev => prev.map(n => (n.id === note.id ? updated : n)));
};


  const filtered = items.filter(n => {
    const matchesSearch =
      !search ||
      n.noteName.toLowerCase().includes(search.toLowerCase()) ||
      (n.noteEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      n.notePhone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : n.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const newCount = items.filter(n => n.status === "new").length;

  return {
    items,
    filtered,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    newCount,
    create,
    update,
    remove,
    setStatus,
    reload: load,
  };
}
