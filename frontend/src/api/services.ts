import { apiCore } from "./core/api";

const BASE = "/services/";

export const ServiceAPI = {
  list: () => apiCore.get(BASE),
  create: (data: { serviceName: string }) => apiCore.post(BASE, data),
  update: (id: number, data: { serviceName: string }) =>
    apiCore.put(`${BASE}${id}/`, data),
  delete: (id: number) => apiCore.del(`${BASE}${id}/`),
};
