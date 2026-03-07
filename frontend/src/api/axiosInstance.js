import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

//Request Interceptor – Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const activeToasts = new Set();

const showToastOnce = (message, type = 'error') => {
  if (activeToasts.has(message)) return;

  activeToasts.add(message);
  toast[type](message, {
    onClose: () => activeToasts.delete(message),  // allow it again after dismissed
  });
};

//  Response Interceptor Refresh Access Token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //refresh token
        const response = await axiosInstance.get('/api/auth/refresh-token', {
          withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    const status  = err.response?.status;
    console.log(status,'-------')
    const message = err.response?.data?.message;

    switch (status) {
      case 400:
        showToastOnce(message || 'Bad request. Please check your input.');
        break;

      case 401:
        showToastOnce('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        break;

      case 404:
        showToastOnce(message || 'The requested resource was not found.');
        break;

      case 409:
        showToastOnce(message || 'Conflict. This resource already exists.');
        break;

      case 500:
        showToastOnce('Something went wrong on our end. Please try again later.');
        break;

      default:
        if (!err.response) {
          showToastOnce('Network error. Please check your internet connection.');
        }
        break;
    }




    return Promise.reject(err);
  }
);

export default axiosInstance;
