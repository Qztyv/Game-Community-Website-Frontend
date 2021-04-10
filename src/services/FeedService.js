import apiClient from "./apiClient";
import handleServiceErrors from "./../utils/handleServiceErrors";

export default {
  async getAllPosts(limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `posts?limit=${limit}&page=${page}&sort=${sort}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async createPost(postForm) {
    let response;
    try {
      response = await apiClient.post("posts", postForm);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getPost(postId) {
    let response;
    try {
      response = await apiClient.get(`posts/${postId}`);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async createDocumentVote(documentId, documentType, directionVal) {
    let response;
    try {
      response = await apiClient.post(
        `${documentType}s/${documentId}/${documentType}Votes`,
        directionVal
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async updateDocumentVote(voteId, documentType, directionVal) {
    let response;
    try {
      response = await apiClient.patch(
        `${documentType}Votes/${voteId}`,
        directionVal
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getAllCommentsOnPost(postId, limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `/posts/${postId}/comments?limit=${limit}&page=${page}&sort=${sort}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async addCommentOnPost(postId, commentForm) {
    let response;
    try {
      response = await apiClient.post(`/posts/${postId}/comments`, commentForm);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getUser(userId) {
    let response;
    try {
      response = await apiClient.get(`/users/${userId}`);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getAllUserPosts(userId, limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `/users/${userId}/posts?limit=${limit}&page=${page}&sort=${sort}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getAllCommentsByUser(userId, limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `/users/${userId}/comments?limit=${limit}&page=${page}&sort=${sort}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
};
