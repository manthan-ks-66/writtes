import axios from "axios";
import handleError from "./errorHandler";

const usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;
const postsBaseUrl = import.meta.env.VITE_POSTS_API_BASE_URL;

const usersInstance = axios.create({
  baseURL: usersBaseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let pendingRequests = [];

usersInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      try {
        await axios.post(
          `${usersBaseUrl}/refresh-access-token`,
          {},
          {
            withCredentials: true,
          },
        );

        return usersInstance(originalRequest);
      } catch (refreshError) {
        handleError(refreshError);

        // backup for error rejection in case handleError fails to throw the error
        Promise.reject(refreshError);
      }
    }
    handleError(error);
  },
);

const postInstance = axios.create({
  baseURL: postsBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export { usersInstance, postInstance };
