import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/users/get-current-user",
});

axiosInstance.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    console.log("the 401 error is intercepted...");
  }
});
