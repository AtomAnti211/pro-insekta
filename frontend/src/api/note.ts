import { apiCore } from "./core/api";
import type { Note } from "../types/note";

export const noteApi = {
  list: (): Promise<Note[]> =>
    apiCore.get("/notes/").then(r => r.data),

  create: (data: Partial<Note>): Promise<Note> =>
    apiCore.post("/notes/", data).then(r => r.data),

  update: (id: number, data: Partial<Note>): Promise<Note> =>
    apiCore.put(`/notes/${id}/`, data).then(r => r.data),

  remove: (id: number): Promise<void> =>
    apiCore.del(`/notes/${id}/`).then(() => {}),

  setStatus: (id: number, status: string): Promise<Note> =>
    apiCore.patch(`/notes/${id}/`, { status }).then(r => r.data),
};
