// src/features/notes/NoteForm.tsx
import { useEffect, useRef, useState } from "react";
import type { Note, NoteStatus } from "../../types/note";

type Props = {
  initial?: Note | null;
  onSubmit: (data: Partial<Note>) => void;
  onCancel: () => void;
};

const STATUS_OPTIONS: { value: NoteStatus; label: string }[] = [
  { value: "new", label: "Új" },
  { value: "in_progress", label: "Folyamatban" },
  { value: "done", label: "Kész" },
];

export default function NoteForm({ initial, onSubmit, onCancel }: Props) {
  const [noteName, setNoteName] = useState("");
  const [noteEmail, setNoteEmail] = useState("");
  const [notePhone, setNotePhone] = useState("");
  const [noteAddress, setNoteAddress] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [status, setStatus] = useState<NoteStatus>("new");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initial) {
      setNoteName(initial.noteName);
      setNoteEmail(initial.noteEmail || "");
      setNotePhone(initial.notePhone);
      setNoteAddress(initial.noteAddress || "");
      setNoteMessage(initial.noteMessage || "");
      setStatus(initial.status);
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      noteName,
      noteEmail,
      notePhone,
      noteAddress,
      noteMessage,
      status,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{initial ? "Jegyzet szerkesztése" : "Új jegyzet"}</h2>

      <label>
        Név:
        <input
          ref={nameRef}
          value={noteName}
          onChange={e => setNoteName(e.target.value)}
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          value={noteEmail}
          onChange={e => setNoteEmail(e.target.value)}
        />
      </label>

      <label>
        Telefon:
        <input
          value={notePhone}
          onChange={e => setNotePhone(e.target.value)}
          required
        />
      </label>

      <label>
        Cím:
        <input
          value={noteAddress}
          onChange={e => setNoteAddress(e.target.value)}
        />
      </label>

      <label>
        Üzenet:
        <textarea
          rows={4}
          value={noteMessage}
          onChange={e => setNoteMessage(e.target.value)}
        />
      </label>

      <label>
        Státusz:
        <select
          value={status}
          onChange={e => setStatus(e.target.value as NoteStatus)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>
          Mégse
        </button>
      </div>
    </form>
  );
}
