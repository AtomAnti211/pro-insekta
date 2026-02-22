import { api } from "./core/api";
import type { Owner } from "../types/owner";

export const ownerAdminApi = {
  get: () =>
    api.get<Owner>("/owner/").then(res => res.data),

  update: (form: FormData) =>
    api.put<Owner>("/owner/", form).then(res => res.data),
};
