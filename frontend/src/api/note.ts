import type { Note } from "../types/note";

const BASE_URL = "http://localhost:8000/api";

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(`${BASE_URL}/notes/`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}
