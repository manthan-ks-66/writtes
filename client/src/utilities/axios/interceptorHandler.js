import axios from "axios";
import handleError from "./errorHandler.js";

const usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;
let isRefreshing = false;
let failedQueue = [];

// call back manager of failed requests queue []
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
};

// Handles response and error as well as refresh accessToken endpoint for 401 Token expired error
const handleAxiosInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const errStatusCode = error?.response?.status;
      const errMsg = error?.response?.data?.message;

      if (
        errMsg === "Id Expired" &&
        errStatusCode === 401 &&
        !originalRequest._retry
      ) {
        /* if 2nd or more reqs comes after the first original req which got the 401 unauthorized error
         * add those reqs to waiting queue []
         * The .then() will process the reqs again when the promises get resolved from the processQueue()
         */
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => axiosInstance(originalRequest));
        }

        // The _retry flag prevents the infinite request retry loop
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            `${usersBaseUrl}/refresh-access-token`,
            {},
            {
              withCredentials: true,
            },
          );

          if (res.status === 200) {
            processQueue(null);
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          processQueue((error = refreshError));
          return Promise.reject(handleError(refreshError));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(handleError(error));
    },
  );
};

export default handleAxiosInterceptor;
