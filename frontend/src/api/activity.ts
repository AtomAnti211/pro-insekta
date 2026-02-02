import type { Activity } from "../types/activity";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function getActivities(): Promise<Activity[]> {
  const res = await fetch(`${BASE_URL}/activities/`);
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}
