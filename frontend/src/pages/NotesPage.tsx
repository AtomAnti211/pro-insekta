import { useEffect, useState } from "react";
import { getNotes } from "../api/note";
import type { Note } from "../types/note";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotes()
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Notes</h1>

      {loading && <p>Loading...</p>}

      {!loading && notes.length === 0 && (
        <p>No notes found.</p>
      )}

      {notes.map(note => (
        <div 
          key={note.id} 
          style={{
            marginBottom: 20,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        >
          <h2>{note.noteName}</h2>
          <p><strong>Activity ID:</strong> {note.noteActivity.id}</p>
          <p><strong>Phone:</strong> {note.notePhone}</p>
          <p><strong>Address:</strong> {note.noteAddress}</p>
          <p><strong>Created:</strong> {new Date(note.noteCreated).toLocaleString()}</p>
          <p><strong>Finished:</strong> {note.noteFinished ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}
