import { api } from "./core/api";
import type { Owner } from "../types/owner";

export async function getOwner(): Promise<Owner> {
  const res = await api.get("/owner/");
  return res.data;
}
