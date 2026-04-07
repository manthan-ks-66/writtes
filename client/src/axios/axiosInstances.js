import axios from "axios";
import handleAxiosInterceptor from "./interceptorHandler";

const usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;
const postsBaseUrl = import.meta.env.VITE_POSTS_API_BASE_URL;

const userInstance = axios.create({
  baseURL: usersBaseUrl,
  withCredentials: true,
});

const postInstance = axios.create({
  baseURL: postsBaseUrl,
  withCredentials: true,
});

handleAxiosInterceptor(userInstance);
handleAxiosInterceptor(postInstance);

export { userInstance, postInstance };
