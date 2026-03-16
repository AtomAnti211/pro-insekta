import axios from "axios";
import { API_URL } from "./config";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// JSON GET / POST / PUT / DELETE / PATCH
export const get = (url: string) => api.get(url);
export const post = (url: string, data: any) => api.post(url, data);
export const put = (url: string, data: any) => api.put(url, data);
export const del = (url: string) => api.delete(url);
export const patch = (url: string, data: any) => api.patch(url, data);

// --- FormData támogatás (kép feltöltéshez) ---
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

// Exportáljuk egységesen
export const apiCore = {
  get,
  post,
  put,
  del,
  patch,      
  postForm,
  putForm,
};
