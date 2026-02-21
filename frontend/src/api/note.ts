import { api } from "./core/api";
import type { Note } from "../types/note";

export async function getNotes(): Promise<Note[]> {
  const res = await api.get<Note[]>("/notes/");
  return res.data;
}
