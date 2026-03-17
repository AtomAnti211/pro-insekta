import { apiCore } from "./core/api";

const BASE = "/customers/";

export const CustomersAPI = {
  list: () => apiCore.get(BASE),
  create: (data: any) => apiCore.post(BASE, data),
  update: (id: number, data: any) => apiCore.put(`${BASE}${id}/`, data),
  delete: (id: number) => apiCore.del(`${BASE}${id}/`),
};
