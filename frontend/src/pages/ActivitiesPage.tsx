import { useEffect, useState } from "react";
import { getActivities } from "../api/activity";
import type { Activity } from "../types/activity";
import "./ActivitiesPage.css";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivities()
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Activities</h1>

      {loading && <p>Loading...</p>}
      {!loading && activities.length === 0 && <p>No activities found.</p>}

      <div className="grid">
        {activities.map(act => (
          <div key={act.id} className="card">
            <img
              src={act.activityURL}
              alt={act.activityName}
              className="card-image"
            />
            <h2 className="card-title">{act.activityName}</h2>
            <p className="card-text">{act.activityDescr}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

