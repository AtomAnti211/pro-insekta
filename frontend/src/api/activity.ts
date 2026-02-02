const BASE_URL = "http://localhost:8000/api";
const MEDIA_URL = "http://localhost:8000";

export async function getActivities() {
  const res = await fetch(`${BASE_URL}/activities/`);
  if (!res.ok) throw new Error("Failed to fetch activities");
  const data = await res.json();

  return data.map((item: any) => ({
    ...item,
    activityURL: MEDIA_URL + item.activityURL
  }));
}
