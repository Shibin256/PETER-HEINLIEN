import axios from 'axios';
import { toast } from 'react-toastify';

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

//Request Interceptor – Attach Access Token
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAccessToken');
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
    onClose: () => activeToasts.delete(message),  
  });
};


//  Response Interceptor Refresh Access Token
adminAxiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (
      (err.response?.status === 401 || err.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        //refresh token
        const response = await adminAxiosInstance.get(
          '/api/auth/refresh-token',
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('adminAccessToken', newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return adminAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        localStorage.removeItem('adminAccessToken');
        window.location.href = '/login';
      }
    }

    const status = err.response?.status;
    console.log(status,'status')
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

export default adminAxiosInstance;
