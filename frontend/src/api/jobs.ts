import { apiCore } from "./core/api";

const BASE = "/jobs/";

export const JobsAPI = {
  list: () => apiCore.get(BASE),
  create: (form: FormData) => apiCore.postForm(BASE, form),
  update: (id: number, form: FormData) => apiCore.putForm(`${BASE}${id}/`, form),
  delete: (id: number) => apiCore.del(`${BASE}${id}/`),
};
