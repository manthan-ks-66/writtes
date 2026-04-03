import axios from "axios";
import { usersInstance } from "./axiosInstance.js";
import handleError from "./errorHandler.js";

class AuthService {
  constructor() {
    this.usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;

    if (!this.usersBaseUrl) {
      throw new Error("VITE_API_BASE_URL env variable is not set");
    }
  }

  async authenticateWithGoogle({ code }) {
    try {
      const res = await axios.post(
        `${this.usersBaseUrl}/google-auth`,
        {
          code,
        },
        {
          withCredentials: true,
        },
      );

      return res.data?.data;
    } catch (error) {
      handleError(error);
    }
  }

  async registerUser(userData) {
    try {
      const res = await axios.post(`${this.usersBaseUrl}/register`, userData, {
        withCredentials: true,
      });

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async regenerateRegistrationOTP() {
    try {
      const res = await axios.post(
        `${this.usersBaseUrl}/regenerate-registration-otp`,
        {},
        {
          withCredentials: true,
        },
      );

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async verifyAndLoginUser({ otp }) {
    try {
      const res = await axios.post(
        `${this.usersBaseUrl}/verify-user`,
        {
          otp: otp.toString(),
        },
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        return res.data?.data;
      }
    } catch (error) {
      handleError(error);
    }
  }

  async loginUser({ username, password }) {
    const response = await usersInstance.post("/login", {
      username,
      password,
    });

    return response.data?.data?.user;
  }

  async logoutUser() {
    await usersInstance.post("/logout", {});
  }

  async getCurrentUser() {
    const response = await usersInstance.get("/get-current-user");

    return response;
  }

  async refreshUserAccessToken() {
    try {
      const res = await axios.post(
        `${this.usersBaseUrl}/refresh-access-token`,
        {},
        {
          withCredentials: true,
        },
      );

      return res.data?.data;
    } catch (error) {
      handleError(error);
    }
  }

  async sendResetPasswordOTP({ email }) {
    const response = await usersInstance.post("/initiate-reset-password-otp", {
      email,
    });

    return response.data;
  }

  async resetUserPassword(data) {
    try {
      const response = await axios.post(
        `${this.usersBaseUrl}/reset-user-password`,
        data,
        {
          withCredentials: true,
        },
      );

      return response;
    } catch (error) {
      handleError(error);
    }
  }
}

const authService = new AuthService();

export default authService;
