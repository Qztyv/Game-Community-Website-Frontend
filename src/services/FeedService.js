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
  async updatePost(postId, postForm) {
    let response;
    try {
      response = await apiClient.patch(`posts/${postId}`, postForm);
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
      // will be comments/*id*/commentVotes, or posts/*id*/postVotes for example
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
      // will be commentVotes/*id* or postVotes/*id*. Could access it truly RESTful if we wanted, but this suffices.
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
  async deleteComment(commentId) {
    let response;
    try {
      response = await apiClient.delete(`comments/${commentId}`);
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
  async getAllFollowingPosts(limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `posts/currentlyFollowing?limit=${limit}&page=${page}&sort=${sort}`
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
