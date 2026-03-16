export type NoteStatus = "new" | "in_progress" | "done";

export interface Note {
  id: number;
  noteName: string;
  noteEmail: string | null;
  notePhone: string;
  noteAddress: string;
  noteMessage: string;
  noteActivity: {
    id: number;
    activityName: string;
  } | null;
  contact_message: string | null;
  status: NoteStatus;
  noteCreated: string;
}
