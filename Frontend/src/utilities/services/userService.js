import { userInstance } from "../configs/axiosInstances.js";

class UserService {
  async updateUserAvatar(formData) {
    const response = await userInstance.patch("/update-avatar", formData);
    return response.data?.data;
  }

  async removeUserAvatar() {
    const response = await userInstance.patch("/remove-avatar", {});
    return response;
  }

  async updateUserDetails(userData) {
    const response = await userInstance.patch("/update-user-details", userData);
    return response.data?.data;
  }

  async getUserLikedPosts() {
    const res = await userInstance.get("/get-user-liked-posts");
    return res.data?.data;
  }

  async getAuthor(username) {
    const response = await userInstance.get(`/get-author/${username}`);
    return response.data?.data;
  }
}

const userService = new UserService();

export default userService;
