import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivity } from "../api/activity";
import Breadcrumb from "../components/Breadcrumb";
import "./ActivityDetailPage.css";

type Activity = {
  id: number;
  activityName: string;
  activityDescr: string;
  activityURL: string;
};

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

      <img
        src={activity.activityURL}
        alt={activity.activityName}
        className="detail-image"
      />

      <p className="detail-text">{activity.activityDescr}</p>
    </div>
  );
}
