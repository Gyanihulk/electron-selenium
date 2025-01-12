const axios = require('axios');
const API_CONFIG = require('./apiConfig');

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reusable API call function
const apiRequest = async (endpoint, method, data = {}, params = {}) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
const generatePostComment = async (postContent, existingComments) => {
  const endpoint = API_CONFIG.ENDPOINTS.generatePostComment;

  const requestBody = {
    postContent,
    existingComments,
  };

  try {
    const response = await apiRequest(endpoint, 'post', requestBody);
    return response;
  } catch (error) {
    console.error('Error in generatePostComment:', error.message);
    throw error;
  }
};

module.exports = {
  apiRequest,generatePostComment
};
