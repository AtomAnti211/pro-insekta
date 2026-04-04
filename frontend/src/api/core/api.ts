import axios from "axios";
import { API_URL } from "./config";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});
// Location locationURL-hez
export const patchForm = (url: string, form: FormData) =>
  api.patch(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
// -----------------------------
// JSON alapú kérések
// -----------------------------
export const get = (url: string) => api.get(url);

export const post = (url: string, data: any) =>
  api.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const put = (url: string, data: any) =>
  api.put(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const del = (url: string) => api.delete(url);

export const patch = (url: string, data: any) =>
  api.patch(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// -----------------------------
// FormData (képfeltöltés) támogatás
// -----------------------------
export const postForm = (url: string, form: FormData) =>
  api.post(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const putForm = (url: string, form: FormData) =>
  api.put(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// -----------------------------
// Export egységes API objektumként
// -----------------------------
export const apiCore = {
  get,
  post,
  put,
  del,
  patch,
  postForm,
  putForm,
  patchForm,   // Location locationURL

};
