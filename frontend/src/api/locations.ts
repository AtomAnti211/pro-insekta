import { apiCore } from "./core/api";

const BASE = "/locations/";

export const LocationsAPI = {
  list: () => apiCore.get(BASE),
  create: (data: any) => apiCore.post(BASE, data),
  patch: (id: number, data: FormData) => apiCore.patchForm(`${BASE}${id}/`, data),
  delete: (id: number) => apiCore.del(`${BASE}${id}/`),
};
