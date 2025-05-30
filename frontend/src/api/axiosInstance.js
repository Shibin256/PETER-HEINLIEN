import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true
})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem('accessToken')
       if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
    },
    (error)=>Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (res)=>res,
    async(err)=>{
        const originalRequest=err.config;
         if (err.response?.status === 403 && !originalRequest._retry) {
             originalRequest._retry = true;
             try {
                const response = await axios.get('/api/refresh-token', {
          withCredentials: true,
        });

          const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

         // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

             } catch (refreshError) {
                 console.error("Refresh token failed", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
             }
         }
          return Promise.reject(err);
    }
)

export default axiosInstance