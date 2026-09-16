import { postInstance } from "../configs/axiosInstances.js";

class PostService {
  async fetchPosts(query) {
    const response = await postInstance(`/get-all-posts${query}`);
    return response.data?.data;
  }

  async fetchPost(postId) {
    const response = await postInstance.get(`/fetch-post/${postId}`);
    return response.data?.data;
  }

  async togglePostLike(postId) {
    const response = await postInstance.post("/toggle-like", { postId });
    return response.data;
  }

  async fetchQueryPost(query) {
    const response = await postInstance.get(`/get-query-post/${query}`);
    return response.data;
  }

  async publishPost(post) {
    const response = await postInstance.post("/publish-post", post);
    return response.data;
  }
}

const postService = new PostService();

export default postService;
