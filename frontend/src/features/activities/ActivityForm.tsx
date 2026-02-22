import { useState, useEffect } from "react";
import type { Activity } from "../../types/activity";
import { useRef } from "react";


type Props = {
  initial?: Activity | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
};

export default function ActivityForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState("");
  const [descr, setDescr] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initial) {
      setName(initial.activityName);
      setDescr(initial.activityDescr);
    }
  }, [initial]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("activityName", name);
    form.append("activityDescr", descr);

    if (file) {
      form.append("activityURL", file);
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form">

      <label>
        Név:
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          ref={nameRef}
        />
      </label>

      <label>
        Leírás:
        <textarea
          value={descr}
          onChange={e => setDescr(e.target.value)}
          rows={5}
          style={{ width: "100%" }}
        />

      </label>

      <label>
        Kép:
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
      </label>

      <div className="form-actions">
        <button type="submit">Mentés</button>
        <button type="button" onClick={onCancel}>Mégse</button>
      </div>
    </form>
  );
}
