import axios from "axios"

export const djangoBackend = axios.create({baseURL: "http://127.0.0.1:8080"})

djangoBackend.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ShortenedLink = {
    id: number,
    originalURL: string,
    active: boolean
}

export async function getLinks():Promise<ShortenedLink[]>{
    try {
        const response = await djangoBackend.get("/api/")
        return await response.data
    } catch (error) {
        console.log("Valami nem jó!");
        console.log(error);
        return []
    }
}

export async function addNewLink(newLink:string){
    try {
        const response = await djangoBackend.post("/api/",{originalURL: newLink})
        return response.data as ShortenedLink
    } catch (error) {
        console.log("Valami nem jó!");
        console.log(error);
    }
}