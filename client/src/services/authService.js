import axios from "axios";
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
    try {
      const response = await axios.post(
        `${this.usersBaseUrl}/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      );

      return response?.data?.data?.user;
    } catch (error) {
      handleError(error);
    }
  }

  async logoutUser() {
    try {
      await axios.post(
        `${this.usersBaseUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      return await axios.get(`${this.usersBaseUrl}/get-current-user`, {
        withCredentials: true,
      });
    } catch (error) {
      handleError(error);
    }
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
    try {
      const response = await axios.post(
        `${this.usersBaseUrl}/initiate-reset-password-otp`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
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
