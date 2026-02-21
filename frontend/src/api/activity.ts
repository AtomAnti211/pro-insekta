import { api } from "./core/api";
import { MEDIA_URL } from "./core/config";
import type { Activity } from "../types/activity";

export async function getActivities(): Promise<Activity[]> {
  const res = await api.get("/activities/");
  return res.data.map((item: any) => ({
    ...item,
    activityURL: MEDIA_URL + item.activityURL,
  }));
}

export async function getActivity(id: number | string): Promise<Activity> {
  const res = await api.get(`/activities/${id}/`);
  return {
    ...res.data,
    activityURL: MEDIA_URL + res.data.activityURL,
  };
}
