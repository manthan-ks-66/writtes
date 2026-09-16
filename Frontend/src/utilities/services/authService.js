import { userInstance } from "../configs/axiosInstances.js";

class AuthService {
  async authenticateWithGoogle({ code }) {
    const response = await userInstance.post("/google-auth", { code });
    return response.data?.data;
  }

  async registerUser(userData) {
    const response = await userInstance.post("/register", userData);
    return response;
  }

  async regenerateRegistrationOTP() {
    const response = await userInstance.post("/regenerate-registration-otp");
    return response;
  }

  async verifyAndLoginUser({ otp }) {
    const response = await userInstance.post("/verify-user", {
      otp: otp?.toString(),
    });
    return response.data?.data;
  }

  async loginUser({ username, password }) {
    const response = await userInstance.post("/login", {
      username,
      password,
    });
    return response.data?.data?.user;
  }

  async logoutUser() {
    await userInstance.post("/logout", {});
  }

  async getCurrentUser() {
    const response = await userInstance.get("/get-current-user");
    return response.data?.data;
  }

  async sendResetPasswordOTP({ email }) {
    const response = await userInstance.post("/initiate-reset-password-otp", {
      email,
    });
    return response.data;
  }

  async resetUserPassword(data) {
    const response = await userInstance.post("/reset-user-password", data);
    return response;
  }
}

const authService = new AuthService();

export default authService;
