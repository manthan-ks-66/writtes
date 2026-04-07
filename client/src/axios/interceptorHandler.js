// Handles refresh accessToken endpoint for 401 Session expired error
import { userInstance } from "./axiosInstances";
import handleError from "../services/errorHandler";
import axios from "axios";

const usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;
let isRefreshing = false;
let failedQueue = [];

// call back manager of failed requests queue []
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
};

const handleAxiosInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    async (response) => {
      console.log("interceptor handler is working");
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const errStatusCode = error?.response?.status;
      const errMsg = error?.response?.data?.message;

      if (
        errStatusCode === 401 &&
        errMsg === "Session Expired" &&
        !originalRequest._retry
      ) {
        // if 2nd or more reqs comes after the first original req which got the 401 unauthorized error
        // add those reqs to waiting queue []
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => userInstance(originalRequest));
        }

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
