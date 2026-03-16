import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivity } from "../api/activity";
import Breadcrumb from "../components/Breadcrumb";
import "./ActivityDetailPage.css";
import type { Activity } from "../types/activity";
export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getActivity(id)
      .then(data => {
        setActivity(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("DETAIL FETCH ERROR:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Betöltés…</p>;
  if (!activity) return <p style={{ padding: 20 }}>Nem található ilyen tevékenység.</p>;

  // Összegyűjtjük a létező képeket
  const images = [
    activity.activityURL,
    activity.activityURL1,
    activity.activityURL2,
    activity.activityURL3,
  ].filter(url => url && url.trim() !== "");

  return (
    <div className="detail-container">

      {/* Breadcrumb navigáció */}
      <Breadcrumb
        items={[
          { label: "Főoldal", to: "/" },
          { label: activity.activityName }
        ]}
      />

      <h1 className="detail-title">{activity.activityName}</h1>

      {/* Több kép megjelenítése */}
      <div className="detail-images">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${activity.activityName} kép ${index + 1}`}
            className="detail-image"
          />
        ))}
      </div>

      <p
        className="detail-text"
        dangerouslySetInnerHTML={{ __html: activity.activityDescr }}>
      </p>

      
    </div>
  );
}