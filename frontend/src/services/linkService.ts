import axios from "axios"

export const djangoBackend = axios.create({baseURL: "http://127.0.0.1:8000"})

djangoBackend.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

djangoBackend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ha 401-et kaptunk és még nem próbáltuk újra
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const refreshResponse = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh }
          );

          const newAccess = refreshResponse.data.access;

          // új access token mentése
          localStorage.setItem("access", newAccess);

          // új token beállítása az eredeti kéréshez
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          // újrapróbáljuk az eredeti kérést
          return djangoBackend(originalRequest);

        } catch (refreshError) {
          // refresh token is lejárt → logout
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

