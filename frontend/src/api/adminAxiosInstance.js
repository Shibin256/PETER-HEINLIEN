import axios from "axios";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

//Request Interceptor – Attach Access Token
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminAccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//  Response Interceptor Refresh Access Token
adminAxiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //refresh token
        const response = await adminAxiosInstance.get("/api/auth/refresh-token", {withCredentials: true,});

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("adminAccessToken", newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return adminAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("adminAccessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default adminAxiosInstance;
