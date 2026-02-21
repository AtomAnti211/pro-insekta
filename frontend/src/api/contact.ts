import { api } from "./core/api";
import type { ContactMessagePayload } from "../types/contactMessage";

export async function sendContactMessage(payload: ContactMessagePayload) {
  const res = await api.post("/contact/", payload);
  return res.data;
}
