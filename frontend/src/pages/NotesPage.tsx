import { useEffect, useState } from "react";
import { getNotes } from "../api/note";
import type { Note } from "../types/note";
import "./NotesPage.css";

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
    <div className="page">
      <h1 className="page-title">Notes</h1>

      {loading && <p>Loading...</p>}
      {!loading && notes.length === 0 && <p>No notes found.</p>}

      {notes.map(note => (
        <div key={note.id} className="note-card">
          <h2 className="note-title">{note.noteName}</h2>

          <div className="note-row">
            <strong>Activity:</strong> {note.noteActivity.activityName}
          </div>

          <div className="note-row">
            <strong>Phone:</strong> {note.notePhone}
          </div>

          <div className="note-row">
            <strong>Address:</strong> {note.noteAddress}
          </div>

          <div className="note-row">
            <strong>Created:</strong>{" "}
            {new Date(note.noteCreated).toLocaleString()}
          </div>

          <div className="note-row">
            <strong>Finished:</strong> {note.noteFinished ? "Yes" : "No"}
          </div>
        </div>
      ))}
    </div>
  );
}
