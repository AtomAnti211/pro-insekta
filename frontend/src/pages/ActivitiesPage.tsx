import { useEffect, useState } from "react";
import { getActivities } from "../api/activity";
import type { Activity } from "../types/activity";

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
    <div style={{ padding: 20 }}>
      <h1>Activities</h1>

      {loading && <p>Loading...</p>}

      {!loading && activities.length === 0 && (
        <p>No activities found.</p>
      )}

      {activities.map(act => (
        <div key={act.id} style={{ marginBottom: 20 }}>
          <h2>{act.activityName}</h2>
          <img 
            src={act.activityURL} 
            alt={act.activityName} 
            style={{ width: 200, borderRadius: 8 }} 
          />
          <p>{act.activityDescr}</p>
        </div>
      ))}
    </div>
  );
}
