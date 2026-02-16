import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "http://localhost:8000/api";

export async function getNotes(): Promise<Note[]> {
  const res = await axios.get<Note[]>(`${BASE_URL}/notes/`);
  return res.data;
}
