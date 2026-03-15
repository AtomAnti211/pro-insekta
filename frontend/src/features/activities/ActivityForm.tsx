import { useState, useEffect, useRef } from "react";
import type { Activity } from "../../types/activity";

type Props = {
  initial?: Activity | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
};

export default function ActivityForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState("");
  const [descr, setDescr] = useState("");

  const [images, setImages] = useState<(string | null)[]>(["", "", "", ""]);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initial) {
      setName(initial.activityName);
      setDescr(initial.activityDescr);

      setImages([
        initial.activityURL,
        initial.activityURL1,
        initial.activityURL2,
        initial.activityURL3
      ]);
    }
  }, [initial]);

  const handleImageChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [...images];
      newImages[index] = reader.result as string;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("activityName", name);
    form.append("activityDescr", descr);

    if (files[0]) form.append("activityURL", files[0]);
    if (files[1]) form.append("activityURL1", files[1]);
    if (files[2]) form.append("activityURL2", files[2]);
    if (files[3]) form.append("activityURL3", files[3]);


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
        />
      </label>

      <div className="image-upload-grid">
        {[0, 1, 2, 3].map(index => (
          <div key={index} className="upload-card">
            <p>{index + 1}. kép</p>

            {images[index] ? (
              <img src={images[index]!} className="upload-preview" />
            ) : (
              <div className="upload-placeholder no-click">Nincs kép</div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={e =>
                handleImageChange(index, e.target.files?.[0] || null)
              }
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">Mentés</button>
        <button type="button" onClick={onCancel}>Mégse</button>
      </div>
    </form>
  );
}
