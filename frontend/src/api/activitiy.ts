import { api } from "./core/api";
import { MEDIA_URL } from "./core/config";
import type { Activity } from "../types/activity";

export async function getActivities(): Promise<Activity[]> {
  const res = await api.get("/activities/");

  return res.data.map((item: any) => ({
    ...item,
    activityURL: item.activityURL ? MEDIA_URL + item.activityURL : "",
    activityURL1: item.activityURL1 ? MEDIA_URL + item.activityURL1 : "",
    activityURL2: item.activityURL2 ? MEDIA_URL + item.activityURL2 : "",
    activityURL3: item.activityURL3 ? MEDIA_URL + item.activityURL3 : "",
  }));
}

export async function getActivity(id: number | string): Promise<Activity> {
  const res = await api.get(`/activities/${id}/`);

  return {
    ...res.data,
    activityURL: res.data.activityURL ? MEDIA_URL + res.data.activityURL : "",
    activityURL1: res.data.activityURL1 ? MEDIA_URL + res.data.activityURL1 : "",
    activityURL2: res.data.activityURL2 ? MEDIA_URL + res.data.activityURL2 : "",
    activityURL3: res.data.activityURL3 ? MEDIA_URL + res.data.activityURL3 : "",
  };
}
