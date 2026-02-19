import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const MEDIA_URL = "http://localhost:8000";

export async function getActivities() {
  const res = await api.get("/activities/");
  return res.data.map((item: any) => ({
    ...item,
    activityURL: MEDIA_URL + item.activityURL
  }));
}

export async function getActivity(id: number | string) {
  const res = await api.get(`/activities/${id}/`);
  return {
    ...res.data,
    activityURL: MEDIA_URL + res.data.activityURL
  };
}

