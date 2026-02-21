import { apiCore } from "./core/api";

export const activityAdminApi = {
  list: () => apiCore.get("/activities/").then(r => r.data),

  create: (form: FormData) =>
    apiCore.postForm("/activities/", form).then(r => r.data),

  update: (id: number, form: FormData) =>
    apiCore.putForm(`/activities/${id}/`, form).then(r => r.data),

  remove: (id: number) =>
    apiCore.del(`/activities/${id}/`),
};
